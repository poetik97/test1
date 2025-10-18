import { PrismaClient } from '@prisma/client';

// Singleton Prisma Client
let prisma: PrismaClient;

declare global {
  var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

export { prisma };
export default prisma;


// User management functions for OAuth
export async function upsertUser(userData: {
  id: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn?: Date;
  role?: 'user' | 'admin';
}) {
  try {
    return await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        name: userData.name,
        email: userData.email,
        loginMethod: userData.loginMethod,
        lastSignedIn: userData.lastSignedIn || new Date(),
      },
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        loginMethod: userData.loginMethod,
        role: userData.role || 'user',
        lastSignedIn: new Date(),
      },
    });
  } catch (error) {
    console.error('[Database] Failed to upsert user:', error);
    throw error;
  }
}

export async function getUser(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('[Database] Failed to get user:', error);
    return null;
  }
}

