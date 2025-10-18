# 🚀 Guia de Deploy - Organiza-te360

## 📋 Resumo do Projeto

**Organiza-te360** é uma plataforma premium de organização pessoal com IA, desenvolvida com:

- ✅ **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- ✅ **Backend**: Express + tRPC 11 (type-safe API)
- ✅ **Database**: Supabase PostgreSQL + Prisma ORM
- ✅ **Auth**: Manus OAuth
- ✅ **Design**: Ultra Premium com glassmorphism
- ✅ **Integrações**: Google Calendar, GPT-4 Chat

## 🎯 Funcionalidades Implementadas

### Páginas Completas (9)
1. **Landing Page** - Hero section, features, benefícios
2. **Dashboard** - Métricas, ações rápidas, insights IA
3. **Tarefas** - Timeline drag & drop, filtros, prioridades
4. **Calendário** - Vista semanal, eventos, integração Google
5. **Finanças** - Transações, categorias, análise
6. **Objetivos SMART** - Tracking, milestones, progresso
7. **Ciclo Menstrual** - Calendário, previsões, sintomas
8. **Diário** - Entradas, análise de sentimento
9. **Chat IA** - GPT-4 integrado, sugestões contextuais

### Componentes
- Sidebar responsiva premium
- Dialogs funcionais (AddTask, AddEvent, AddGoal, AddTransaction)
- Design System completo
- Animações suaves

### Backend (tRPC)
- ✅ Auth (login/logout)
- ✅ Tasks CRUD
- ✅ Events CRUD
- ✅ Goals CRUD
- ✅ Transactions CRUD
- ✅ Dashboard stats

## 📦 Pré-requisitos para Deploy

### 1. Google Cloud Console
- Projeto configurado
- Domínio apontado
- Cloud Run ou App Engine configurado

### 2. Supabase
- Projeto: `aswqsbeyujcavceowgzm`
- Database PostgreSQL ativo
- Connection strings prontas

### 3. Variáveis de Ambiente

Configure no Google Cloud:

```bash
# Database
DATABASE_URL="postgresql://postgres.aswqsbeyujcavceowgzm:7efZkNYdF0T1dQjQ@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase
SUPABASE_URL="https://aswqsbeyujcavceowgzm.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzd3FzYmV5dWpjYXZjZW93Z3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjIyNzcsImV4cCI6MjA2MzM5ODI3N30.u5L8GpGGRSG44af8O5WUuRBH6SXR9hB9c6w0NhRKnvo"

# Manus OAuth (já configuradas automaticamente)
JWT_SECRET="..."
OAUTH_SERVER_URL="..."
VITE_OAUTH_PORTAL_URL="..."

# Google OAuth (opcional - para Google Calendar)
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-secret"
GOOGLE_REDIRECT_URI="https://seu-dominio.com/api/google/callback"
```

## 🗄️ Passos de Deploy

### Passo 1: Build do Projeto

```bash
# Instalar dependências
pnpm install

# Gerar Prisma Client
npx prisma generate

# Build do frontend e backend
pnpm build
```

### Passo 2: Aplicar Schema ao Supabase

**IMPORTANTE**: Execute isto APÓS fazer deploy no Google Cloud (para ter acesso ao Supabase):

```bash
# Aplicar schema à base de dados
npx prisma db push

# Verificar tabelas criadas
npx prisma studio
```

Isto criará 16 tabelas no Supabase:
- users, tasks, events, goals, goal_checkins
- transactions, financial_categories
- diary_entries, chat_messages
- notifications, automations
- menstrual_cycles
- badges, user_badges, achievements
- google_tokens

### Passo 3: Deploy no Google Cloud

#### Opção A: Cloud Run (Recomendado)

```bash
# Criar Dockerfile (já incluído no projeto)
docker build -t organiza-te360 .

# Push para Google Container Registry
gcloud builds submit --tag gcr.io/SEU-PROJETO/organiza-te360

# Deploy
gcloud run deploy organiza-te360 \
  --image gcr.io/SEU-PROJETO/organiza-te360 \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

#### Opção B: App Engine

```bash
# Criar app.yaml
runtime: nodejs22
env: standard
instance_class: F2

# Deploy
gcloud app deploy
```

### Passo 4: Configurar Domínio

```bash
# Mapear domínio personalizado
gcloud run domain-mappings create \
  --service organiza-te360 \
  --domain seu-dominio.com \
  --region europe-west1
```

### Passo 5: Configurar SSL/HTTPS

O Google Cloud Run/App Engine já fornece SSL automático.

### Passo 6: Testar

1. Acesse `https://seu-dominio.com`
2. Teste login com Manus OAuth
3. Crie uma tarefa, evento, objetivo
4. Verifique dados no Supabase Dashboard

## 🔒 Segurança

### Row Level Security (RLS) no Supabase

Execute no Supabase SQL Editor:

```sql
-- Ativar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Política exemplo para tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "Users can create own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = "userId");

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = "userId");
```

Repita para todas as tabelas.

## 📊 Monitorização

### Google Cloud Monitoring
- Logs: `gcloud logging read`
- Métricas: Cloud Console → Monitoring

### Supabase Dashboard
- Database → Table Editor
- Logs → Database Logs
- API → API Logs

## 🐛 Troubleshooting

### Erro: "Can't reach database server"
- ✅ Verifique DATABASE_URL está correta
- ✅ Confirme que Supabase está ativo
- ✅ Use connection pooling (porta 6543)

### Erro: "Prisma Client not generated"
- ✅ Execute `npx prisma generate`
- ✅ Verifique `node_modules/@prisma/client` existe

### Erro: "tRPC procedures failing"
- ✅ Verifique schema Prisma está aplicado
- ✅ Confirme tabelas existem no Supabase
- ✅ Teste queries diretamente com Prisma Studio

## 📈 Performance

### Otimizações Implementadas
- ✅ Connection pooling (pgBouncer)
- ✅ Índices nas foreign keys
- ✅ Lazy loading de componentes
- ✅ Code splitting automático

### Recomendações
- Use CDN para assets estáticos
- Configure caching no Cloud Run
- Monitore queries lentas no Supabase

## 🔄 Atualizações Futuras

Para adicionar novas funcionalidades:

1. Edite `prisma/schema.prisma`
2. Execute `npx prisma db push`
3. Atualize `server/routers.ts`
4. Adicione UI em `client/src/pages/`
5. Deploy

## 📞 Suporte

- **Supabase**: https://supabase.com/dashboard
- **Google Cloud**: https://console.cloud.google.com
- **Prisma Docs**: https://www.prisma.io/docs

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] DATABASE_URL configurada
- [ ] Schema aplicado ao Supabase (`npx prisma db push`)
- [ ] RLS policies configuradas
- [ ] Domínio mapeado e SSL ativo
- [ ] Google OAuth configurado (se usar Google Calendar)
- [ ] Testes de login/CRUD funcionando
- [ ] Backups automáticos configurados no Supabase
- [ ] Monitorização ativa

---

**Projeto pronto para produção!** 🚀

Desenvolvido com ❤️ usando Manus AI

