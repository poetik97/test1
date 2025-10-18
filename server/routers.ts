import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import supabase from "./supabase";
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
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('userId', ctx.user.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return data || [];
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
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            status: input.status || 'todo',
            priority: input.priority || 'medium',
            category: input.category || 'other',
            dueDate: input.dueDate || null,
            scheduledTime: input.scheduledTime,
            estimatedTime: input.estimatedTime,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', input.id)
          .eq('userId', ctx.user.id)
          .maybeSingle();

        return data;
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
        const { id, ...updates } = input;
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .eq('userId', ctx.user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', input.id)
          .eq('userId', ctx.user.id);

        if (error) throw error;
        return { success: true };
      }),

    toggleStatus: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { data: task } = await supabase
          .from('tasks')
          .select('status')
          .eq('id', input.id)
          .eq('userId', ctx.user.id)
          .single();

        if (!task) throw new Error('Task not found');

        const { data, error } = await supabase
          .from('tasks')
          .update({ status: task.status === 'done' ? 'todo' : 'done' })
          .eq('id', input.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),
  }),

  events: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('userId', ctx.user.id)
        .order('startTime', { ascending: true });

      if (error) throw error;
      return data || [];
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
        const { data, error } = await supabase
          .from('events')
          .insert({
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            startTime: input.startTime,
            endTime: input.endTime,
            location: input.location,
            category: input.category || 'other',
          })
          .select()
          .single();

        if (error) throw error;
        return data;
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
        const { id, ...updates } = input;
        const { data, error } = await supabase
          .from('events')
          .update(updates)
          .eq('id', id)
          .eq('userId', ctx.user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', input.id)
          .eq('userId', ctx.user.id);

        if (error) throw error;
        return { success: true };
      }),
  }),

  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('goals')
        .select('*, goal_checkins(*)')
        .eq('userId', ctx.user.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return data || [];
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
        const { data, error } = await supabase
          .from('goals')
          .insert({
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            targetValue: input.targetValue,
            currentValue: input.currentValue || 0,
            unit: input.unit,
            deadline: input.deadline || null,
            category: input.category || 'other',
          })
          .select()
          .single();

        if (error) throw error;
        return data;
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
        const { id, ...updates } = input;
        const { data, error } = await supabase
          .from('goals')
          .update(updates)
          .eq('id', id)
          .eq('userId', ctx.user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { error } = await supabase
          .from('goals')
          .delete()
          .eq('id', input.id)
          .eq('userId', ctx.user.id);

        if (error) throw error;
        return { success: true };
      }),

    updateProgress: protectedProcedure
      .input(z.object({ id: z.string(), currentValue: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { data: goal } = await supabase
          .from('goals')
          .select('targetValue')
          .eq('id', input.id)
          .eq('userId', ctx.user.id)
          .single();

        if (!goal) throw new Error('Goal not found');

        const status = input.currentValue >= goal.targetValue ? 'completed' : 'active';

        const { data, error } = await supabase
          .from('goals')
          .update({ currentValue: input.currentValue, status })
          .eq('id', input.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),
  }),

  transactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('userId', ctx.user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
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
        const { data, error } = await supabase
          .from('transactions')
          .insert({
            userId: ctx.user.id,
            type: input.type,
            amount: input.amount,
            category: input.category,
            description: input.description,
            date: input.date,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
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
        const { id, ...updates } = input;
        const { data, error } = await supabase
          .from('transactions')
          .update(updates)
          .eq('id', id)
          .eq('userId', ctx.user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', input.id)
          .eq('userId', ctx.user.id);

        if (error) throw error;
        return { success: true };
      }),
  }),

  // Diary Router
  diary: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('userId', ctx.user.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return data || [];
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        mood: z.enum(['very_bad', 'bad', 'neutral', 'good', 'very_good']).optional(),
        date: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { data, error } = await supabase
          .from('diary_entries')
          .insert({
            userId: ctx.user.id,
            title: input.title,
            content: input.content,
            mood: input.mood || 'neutral',
          })
          .select()
          .single();

        if (error) throw error;
        return data;
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
        const { id, ...updates } = input;
        const { data, error } = await supabase
          .from('diary_entries')
          .update(updates)
          .eq('id', id)
          .eq('userId', ctx.user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { error } = await supabase
          .from('diary_entries')
          .delete()
          .eq('id', input.id)
          .eq('userId', ctx.user.id);

        if (error) throw error;
        return { success: true };
      }),
  }),

  // Menstrual Cycle Router
  menstrualCycle: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .eq('userId', ctx.user.id)
        .order('startDate', { ascending: false });

      if (error) throw error;
      return data || [];
    }),

    create: protectedProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string().optional(),
        flow: z.enum(['light', 'medium', 'heavy']).optional(),
        symptoms: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { data, error } = await supabase
          .from('menstrual_cycles')
          .insert({
            userId: ctx.user.id,
            startDate: input.startDate,
            endDate: input.endDate || null,
            flow: input.flow || 'medium',
            notes: input.symptoms,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
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
        const { id, symptoms, ...updates } = input;
        const updateData = { ...updates };
        if (symptoms) updateData.notes = symptoms;

        const { data, error } = await supabase
          .from('menstrual_cycles')
          .update(updateData)
          .eq('id', id)
          .eq('userId', ctx.user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { error } = await supabase
          .from('menstrual_cycles')
          .delete()
          .eq('id', input.id)
          .eq('userId', ctx.user.id);

        if (error) throw error;
        return { success: true };
      }),
  }),

  // Chat IA Router
  chat: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('userId', ctx.user.id)
        .order('createdAt', { ascending: true })
        .limit(50);

      if (error) throw error;
      return data || [];
    }),

    send: protectedProcedure
      .input(z.object({
        message: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await supabase
          .from('chat_messages')
          .insert({
            userId: ctx.user.id,
            role: 'user',
            content: input.message,
          });

        // TODO: Integrate with GPT-4 API
        const aiResponse = "Funcionalidade de IA será integrada em breve!";

        // Save AI response
        const { data, error } = await supabase
          .from('chat_messages')
          .insert({
            userId: ctx.user.id,
            role: 'assistant',
            content: aiResponse,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }),
  }),

  // Notifications Router
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', ctx.user.id)
        .order('createdAt', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { data, error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', input.id)
          .eq('userId', ctx.user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }),
  }),

  // Gamification Router
  gamification: router({
    profile: protectedProcedure.query(async ({ ctx }) => {
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('userId', ctx.user.id);

      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('userId', ctx.user.id)
        .order('createdAt', { ascending: false });

      return {
        level: Math.floor((ctx.user.xp || 0) / 1000) + 1,
        xp: ctx.user.xp || 0,
        badges: userBadges || [],
        achievements: achievements || [],
      };
    }),
  }),

  // Dashboard Stats
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      const [tasksResult, eventsResult, goalsResult, transactionsResult] = await Promise.all([
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('userId', ctx.user.id).neq('status', 'done'),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('userId', ctx.user.id).gte('startTime', new Date().toISOString()),
        supabase.from('goals').select('id', { count: 'exact', head: true }).eq('userId', ctx.user.id).eq('status', 'active'),
        supabase.from('transactions').select('type, amount').eq('userId', ctx.user.id),
      ]);

      const balance = (transactionsResult.data || []).reduce((acc, t) => {
        return acc + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);

      return {
        tasksCount: tasksResult.count || 0,
        eventsCount: eventsResult.count || 0,
        goalsCount: goalsResult.count || 0,
        balance,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
