# Configuração do Supabase para Organiza-te360

## 📋 Pré-requisitos

- Projeto Supabase criado: `aswqsbeyujcavceowgzm`
- PostgreSQL database ativo

## 🔧 Passo 1: Configurar Variáveis de Ambiente

No seu ambiente de produção (Google Cloud), configure:

```bash
DATABASE_URL="postgresql://postgres.aswqsbeyujcavceowgzm:7efZkNYdF0T1dQjQ@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

SUPABASE_URL="https://aswqsbeyujcavceowgzm.supabase.co"

SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzd3FzYmV5dWpjYXZjZW93Z3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjIyNzcsImV4cCI6MjA2MzM5ODI3N30.u5L8GpGGRSG44af8O5WUuRBH6SXR9hB9c6w0NhRKnvo"
```

## 🗄️ Passo 2: Aplicar Schema ao Supabase

Depois de fazer deploy no Google Cloud, execute:

```bash
# Gerar Prisma Client
npx prisma generate

# Aplicar schema à base de dados
npx prisma db push
```

## ✅ Passo 3: Verificar Tabelas Criadas

No Supabase Dashboard → Table Editor, deverá ver:

- ✅ users
- ✅ tasks
- ✅ events
- ✅ goals
- ✅ goal_checkins
- ✅ transactions
- ✅ financial_categories
- ✅ diary_entries
- ✅ chat_messages
- ✅ notifications
- ✅ automations
- ✅ menstrual_cycles
- ✅ badges
- ✅ user_badges
- ✅ achievements
- ✅ google_tokens

## 🔐 Passo 4: Configurar Row Level Security (RLS)

No Supabase Dashboard, ative RLS para cada tabela:

```sql
-- Exemplo para tabela users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

Repita para todas as tabelas, ajustando as políticas conforme necessário.

## 🚀 Passo 5: Testar Conexão

Execute o servidor e teste:

```bash
npm run dev

# Ou em produção
npm run build
npm start
```

## 📊 Schema Prisma

O schema completo está em `prisma/schema.prisma` com:

- 16 modelos (tabelas)
- Relações configuradas
- Índices otimizados
- Enums TypeScript-safe

## 🔄 Migrações Futuras

Para adicionar novas tabelas/campos:

1. Edite `prisma/schema.prisma`
2. Execute `npx prisma db push`
3. Commit as alterações

## ⚠️ Notas Importantes

- **Connection Pooling**: Use a URL com pooling (porta 6543) para produção
- **Direct Connection**: Use porta 5432 apenas para migrações
- **Backups**: Configure backups automáticos no Supabase Dashboard
- **Limites**: Free tier tem limite de 500MB storage e 2GB bandwidth/mês

## 📞 Suporte

Em caso de problemas:
1. Verifique logs no Supabase Dashboard
2. Confirme que DATABASE_URL está correta
3. Teste conexão com `npx prisma db pull`

