import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import prisma from "./db";
import { registerUser, loginUser } from "./auth";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { user, token } = await registerUser(input.email, input.password, input.name);
        
        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        return { success: true, user };
      }),
    
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { user, token } = await loginUser(input.email, input.password);
        
        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        return { success: true, user };
      }),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  tasks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await prisma.task.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: 'desc' },
      });
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done', 'archived']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        category: z.enum(['work', 'personal', 'health', 'finance', 'other']).optional(),
        dueDate: z.string().optional(),
        scheduledTime: z.string().optional(),
        estimatedTime: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.task.create({
          data: {
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            status: input.status || 'todo',
            priority: input.priority || 'medium',
            category: input.category || 'other',
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
            scheduledTime: input.scheduledTime,
            estimatedTime: input.estimatedTime,
          },
        });
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await prisma.task.findFirst({
          where: { id: input.id, userId: ctx.user.id },
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done', 'archived']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        category: z.enum(['work', 'personal', 'health', 'finance', 'other']).optional(),
        dueDate: z.string().optional(),
        scheduledTime: z.string().optional(),
        estimatedTime: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return await prisma.task.update({
          where: { id },
          data: {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          },
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.task.delete({
          where: { id: input.id },
        });
      }),

    toggleStatus: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: { id: input.id, userId: ctx.user.id },
        });
        if (!task) throw new Error('Task not found');
        
        return await prisma.task.update({
          where: { id: input.id },
          data: { status: task.status === 'done' ? 'todo' : 'done' },
        });
      }),
  }),

  events: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await prisma.event.findMany({
        where: { userId: ctx.user.id },
        orderBy: { startTime: 'asc' },
      });
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        startTime: z.string(),
        endTime: z.string(),
        location: z.string().optional(),
        category: z.enum(['work', 'personal', 'health', 'finance', 'other']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.event.create({
          data: {
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            startTime: new Date(input.startTime),
            endTime: new Date(input.endTime),
            location: input.location,
            category: input.category || 'other',
          },
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        location: z.string().optional(),
        category: z.enum(['work', 'personal', 'health', 'finance', 'other']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return await prisma.event.update({
          where: { id },
          data: {
            ...data,
            startTime: data.startTime ? new Date(data.startTime) : undefined,
            endTime: data.endTime ? new Date(data.endTime) : undefined,
          },
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.event.delete({
          where: { id: input.id },
        });
      }),
  }),

  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await prisma.goal.findMany({
        where: { userId: ctx.user.id },
        include: { checkins: true },
        orderBy: { createdAt: 'desc' },
      });
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        targetValue: z.number(),
        currentValue: z.number().optional(),
        unit: z.string(),
        deadline: z.string().optional(),
        category: z.enum(['work', 'personal', 'health', 'finance', 'other']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.goal.create({
          data: {
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            targetValue: input.targetValue,
            currentValue: input.currentValue || 0,
            unit: input.unit,
            deadline: input.deadline ? new Date(input.deadline) : null,
            category: input.category || 'other',
          },
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        targetValue: z.number().optional(),
        currentValue: z.number().optional(),
        unit: z.string().optional(),
        deadline: z.string().optional(),
        category: z.enum(['work', 'personal', 'health', 'finance', 'other']).optional(),
        status: z.enum(['active', 'completed', 'abandoned']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return await prisma.goal.update({
          where: { id },
          data: {
            ...data,
            deadline: data.deadline ? new Date(data.deadline) : undefined,
          },
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.goal.delete({
          where: { id: input.id },
        });
      }),

    updateProgress: protectedProcedure
      .input(z.object({ id: z.string(), currentValue: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const goal = await prisma.goal.findFirst({
          where: { id: input.id, userId: ctx.user.id },
        });
        if (!goal) throw new Error('Goal not found');
        
        const status = input.currentValue >= goal.targetValue ? 'completed' : 'active';
        
        return await prisma.goal.update({
          where: { id: input.id },
          data: { 
            currentValue: input.currentValue,
            status,
          },
        });
      }),
  }),

  transactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await prisma.transaction.findMany({
        where: { userId: ctx.user.id },
        orderBy: { date: 'desc' },
      });
    }),

    create: protectedProcedure
      .input(z.object({
        type: z.enum(['income', 'expense']),
        amount: z.number(),
        category: z.string(),
        description: z.string().optional(),
        date: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.transaction.create({
          data: {
            userId: ctx.user.id,
            type: input.type,
            amount: input.amount,
            category: input.category,
            description: input.description,
            date: new Date(input.date),
          },
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        type: z.enum(['income', 'expense']).optional(),
        amount: z.number().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        date: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return await prisma.transaction.update({
          where: { id },
          data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined,
          },
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.transaction.delete({
          where: { id: input.id },
        });
      }),
  }),

  // Diary Router
  diary: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await prisma.diaryEntry.findMany({
        where: { userId: ctx.user.id },
        orderBy: { date: 'desc' },
      });
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        mood: z.enum(['very_bad', 'bad', 'neutral', 'good', 'very_good']).optional(),
        date: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.diaryEntry.create({
          data: {
            userId: ctx.user.id,
            title: input.title,
            content: input.content,
            mood: input.mood || 'neutral',
            date: input.date ? new Date(input.date) : new Date(),
          },
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        mood: z.enum(['very_bad', 'bad', 'neutral', 'good', 'very_good']).optional(),
        date: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return await prisma.diaryEntry.update({
          where: { id },
          data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined,
          },
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.diaryEntry.delete({
          where: { id: input.id },
        });
      }),
  }),

  // Menstrual Cycle Router
  menstrualCycle: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await prisma.menstrualCycle.findMany({
        where: { userId: ctx.user.id },
        orderBy: { startDate: 'desc' },
      });
    }),

    create: protectedProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string().optional(),
        flow: z.enum(['light', 'medium', 'heavy']).optional(),
        symptoms: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.menstrualCycle.create({
          data: {
            userId: ctx.user.id,
            startDate: new Date(input.startDate),
            endDate: input.endDate ? new Date(input.endDate) : null,
            flow: input.flow || 'medium',
            symptoms: input.symptoms,
          },
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        flow: z.enum(['light', 'medium', 'heavy']).optional(),
        symptoms: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return await prisma.menstrualCycle.update({
          where: { id },
          data: {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
          },
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.menstrualCycle.delete({
          where: { id: input.id },
        });
      }),
  }),

  // Chat IA Router
  chat: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await prisma.chatMessage.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: 'asc' },
        take: 50,
      });
    }),

    send: protectedProcedure
      .input(z.object({
        message: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await prisma.chatMessage.create({
          data: {
            userId: ctx.user.id,
            role: 'user',
            content: input.message,
          },
        });

        // TODO: Integrate with GPT-4 API
        const aiResponse = "Funcionalidade de IA será integrada em breve!";

        // Save AI response
        return await prisma.chatMessage.create({
          data: {
            userId: ctx.user.id,
            role: 'assistant',
            content: aiResponse,
          },
        });
      }),
  }),

  // Notifications Router
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await prisma.notification.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await prisma.notification.update({
          where: { id: input.id, userId: ctx.user.id },
          data: { read: true },
        });
      }),
  }),

  // Gamification Router
  gamification: router({
    profile: protectedProcedure.query(async ({ ctx }) => {
      const userBadges = await prisma.userBadge.findMany({
        where: { userId: ctx.user.id },
        include: { badge: true },
      });

      const achievements = await prisma.achievement.findMany({
        where: { userId: ctx.user.id },
        orderBy: { unlockedAt: 'desc' },
      });

      return {
        level: Math.floor(ctx.user.xp / 1000) + 1,
        xp: ctx.user.xp || 0,
        badges: userBadges,
        achievements,
      };
    }),
  }),

  // Dashboard Stats
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      const [tasksCount, eventsCount, goalsCount, transactions] = await Promise.all([
        prisma.task.count({ where: { userId: ctx.user.id, status: { not: 'done' } } }),
        prisma.event.count({ where: { userId: ctx.user.id, startTime: { gte: new Date() } } }),
        prisma.goal.count({ where: { userId: ctx.user.id, status: 'active' } }),
        prisma.transaction.findMany({
          where: { userId: ctx.user.id },
          select: { type: true, amount: true },
        }),
      ]);

      const balance = transactions.reduce((acc, t) => {
        return acc + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);

      return {
        tasksCount,
        eventsCount,
        goalsCount,
        balance,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
