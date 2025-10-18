/*
  # Create Organiza-te360 Complete Schema

  1. New Enums
    - Role (user, admin)
    - TaskStatus (todo, in_progress, done, archived)
    - Priority (low, medium, high)
    - Category (work, personal, health, finance, other)
    - GoalStatus (active, completed, paused, cancelled)
    - TransactionType (income, expense)
    - BadgeRarity (common, rare, epic, legendary)

  2. New Tables
    - users: User accounts with profile and gamification data
    - tasks: Task management with priorities and categories
    - events: Calendar events
    - goals: Goal tracking with check-ins
    - goal_checkins: Progress tracking for goals
    - transactions: Financial transactions
    - financial_categories: Budget categories
    - diary_entries: Personal diary with mood tracking
    - chat_messages: AI chat history
    - notifications: User notifications
    - automations: Workflow automations
    - menstrual_cycles: Menstrual cycle tracking
    - badges: Achievement badges
    - user_badges: User earned badges
    - achievements: User achievements
    - google_tokens: Google OAuth tokens

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create Enums
CREATE TYPE "Role" AS ENUM ('user', 'admin');
CREATE TYPE "TaskStatus" AS ENUM ('todo', 'in_progress', 'done', 'archived');
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');
CREATE TYPE "Category" AS ENUM ('work', 'personal', 'health', 'finance', 'other');
CREATE TYPE "GoalStatus" AS ENUM ('active', 'completed', 'paused', 'cancelled');
CREATE TYPE "TransactionType" AS ENUM ('income', 'expense');
CREATE TYPE "BadgeRarity" AS ENUM ('common', 'rare', 'epic', 'legendary');

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  "loginMethod" TEXT,
  role "Role" DEFAULT 'user',
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "lastSignedIn" TIMESTAMPTZ DEFAULT now(),
  avatar TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'Europe/Lisbon',
  language TEXT DEFAULT 'pt',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  "lastActivityDate" TIMESTAMPTZ
);

-- Create Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status "TaskStatus" DEFAULT 'todo',
  priority "Priority" DEFAULT 'medium',
  category "Category" DEFAULT 'other',
  "dueDate" TIMESTAMPTZ,
  "scheduledTime" TEXT,
  "estimatedTime" INTEGER,
  "completedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tasks_userId_idx ON tasks("userId");

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "startTime" TIMESTAMPTZ NOT NULL,
  "endTime" TIMESTAMPTZ NOT NULL,
  location TEXT,
  category "Category" DEFAULT 'other',
  color TEXT,
  "googleEventId" TEXT UNIQUE,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_userId_idx ON events("userId");

-- Create Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "targetValue" INTEGER NOT NULL,
  "currentValue" INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  status "GoalStatus" DEFAULT 'active',
  category "Category" DEFAULT 'other',
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS goals_userId_idx ON goals("userId");

-- Create Goal Checkins Table
CREATE TABLE IF NOT EXISTS goal_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "goalId" UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  value INTEGER NOT NULL,
  note TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS goal_checkins_goalId_idx ON goal_checkins("goalId");

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type "TransactionType" NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transactions_userId_idx ON transactions("userId");

-- Create Financial Categories Table
CREATE TABLE IF NOT EXISTS financial_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type "TransactionType" NOT NULL,
  icon TEXT,
  color TEXT,
  budget DOUBLE PRECISION,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Create Diary Entries Table
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT[] DEFAULT '{}',
  sentiment TEXT,
  "sentimentScore" INTEGER,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS diary_entries_userId_idx ON diary_entries("userId");

-- Create Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_userId_idx ON chat_messages("userId");

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  "actionUrl" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_userId_idx ON notifications("userId");

-- Create Automations Table
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger JSONB NOT NULL,
  action JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  "lastRun" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS automations_userId_idx ON automations("userId");

-- Create Menstrual Cycles Table
CREATE TABLE IF NOT EXISTS menstrual_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "startDate" TIMESTAMPTZ NOT NULL,
  "endDate" TIMESTAMPTZ,
  "cycleLength" INTEGER,
  "periodLength" INTEGER,
  flow TEXT,
  symptoms TEXT[] DEFAULT '{}',
  mood TEXT,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS menstrual_cycles_userId_idx ON menstrual_cycles("userId");

-- Create Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  requirement JSONB,
  rarity "BadgeRarity" DEFAULT 'common',
  "xpReward" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Create User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "badgeId" UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  "earnedAt" TIMESTAMPTZ DEFAULT now(),
  progress INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS user_badges_userId_idx ON user_badges("userId");
CREATE INDEX IF NOT EXISTS user_badges_badgeId_idx ON user_badges("badgeId");

-- Create Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  "xpEarned" INTEGER DEFAULT 0,
  metadata JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS achievements_userId_idx ON achievements("userId");

-- Create Google Tokens Table
CREATE TABLE IF NOT EXISTS google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL UNIQUE REFERENCES users(id),
  "accessToken" TEXT NOT NULL,
  "refreshToken" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menstrual_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create RLS Policies for Tasks
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Events
CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Goals
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Goal Checkins
CREATE POLICY "Users can view own goal checkins"
  ON goal_checkins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = goal_checkins."goalId"
      AND goals."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can insert own goal checkins"
  ON goal_checkins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = goal_checkins."goalId"
      AND goals."userId" = auth.uid()
    )
  );

-- Create RLS Policies for Transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Financial Categories (public read, admin write)
CREATE POLICY "Anyone can view financial categories"
  ON financial_categories FOR SELECT
  TO authenticated
  USING (true);

-- Create RLS Policies for Diary Entries
CREATE POLICY "Users can view own diary entries"
  ON diary_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own diary entries"
  ON diary_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own diary entries"
  ON diary_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own diary entries"
  ON diary_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Chat Messages
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

-- Create RLS Policies for Notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

-- Create RLS Policies for Automations
CREATE POLICY "Users can view own automations"
  ON automations FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own automations"
  ON automations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own automations"
  ON automations FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own automations"
  ON automations FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Menstrual Cycles
CREATE POLICY "Users can view own menstrual cycles"
  ON menstrual_cycles FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own menstrual cycles"
  ON menstrual_cycles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own menstrual cycles"
  ON menstrual_cycles FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own menstrual cycles"
  ON menstrual_cycles FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Badges (public read)
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- Create RLS Policies for User Badges
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Achievements
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

-- Create RLS Policies for Google Tokens
CREATE POLICY "Users can view own google tokens"
  ON google_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own google tokens"
  ON google_tokens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own google tokens"
  ON google_tokens FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own google tokens"
  ON google_tokens FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");
