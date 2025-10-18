import { eq } from "drizzle-orm";
import { googleTokens, InsertGoogleToken } from "../drizzle/schema";
import { getDb } from "./db";

// Guardar ou atualizar token do Google
export async function upsertGoogleToken(token: InsertGoogleToken): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert Google token: database not available");
    return;
  }

  try {
    await db.insert(googleTokens).values(token).onDuplicateKeyUpdate({
      set: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiryDate: token.expiryDate,
        scope: token.scope,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert Google token:", error);
    throw error;
  }
}

// Obter token do Google por userId
export async function getGoogleToken(userId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get Google token: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(googleTokens)
    .where(eq(googleTokens.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Eliminar token do Google
export async function deleteGoogleToken(userId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete Google token: database not available");
    return;
  }

  await db.delete(googleTokens).where(eq(googleTokens.userId, userId));
}

// Verificar se o token está expirado
export function isTokenExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return true;
  return new Date() >= new Date(expiryDate);
}

