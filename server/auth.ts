import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Register new user
export async function registerUser(email: string, password: string, name: string) {
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    throw new Error('Email já está em uso');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email,
      password: passwordHash,
      name,
      role: 'user',
      loginMethod: 'email',
    })
    .select()
    .single();

  if (error || !user) {
    throw new Error('Erro ao criar usuário');
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return { user, token };
}

// Login user
export async function loginUser(email: string, password: string) {
  // Find user
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (!user || !user.password) {
    throw new Error('Email ou password inválidos');
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new Error('Email ou password inválidos');
  }

  // Update last signed in
  await supabase
    .from('users')
    .update({ lastSignedIn: new Date().toISOString() })
    .eq('id', user.id);

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return { user, token };
}

// Get user from token
export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', decoded.id)
    .maybeSingle();

  return user;
}

