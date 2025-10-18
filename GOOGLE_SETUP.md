# Configuração Google OAuth e Calendar API

Este documento explica como configurar as credenciais do Google Cloud Console para ativar o login com Google e a sincronização com Google Calendar.

## 📋 Pré-requisitos

- Conta Google
- Acesso ao [Google Cloud Console](https://console.cloud.google.com/)

## 🚀 Passo a Passo

### 1. Criar Projeto no Google Cloud Console

1. Aceda a https://console.cloud.google.com/
2. Clique em **"Select a project"** → **"New Project"**
3. Nome do projeto: `Organiza-te360`
4. Clique em **"Create"**

### 2. Ativar APIs Necessárias

1. No menu lateral, vá a **"APIs & Services"** → **"Library"**
2. Procure e ative as seguintes APIs:
   - **Google Calendar API**
   - **Google+ API** (ou People API)

### 3. Configurar OAuth Consent Screen

1. Vá a **"APIs & Services"** → **"OAuth consent screen"**
2. Escolha **"External"** (para utilizadores públicos)
3. Preencha os campos obrigatórios:
   - **App name**: `Organiza-te360`
   - **User support email**: seu email
   - **Developer contact information**: seu email
4. Clique em **"Save and Continue"**
5. Em **"Scopes"**, adicione:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `.../auth/calendar`
   - `.../auth/calendar.events`
6. Clique em **"Save and Continue"**
7. Em **"Test users"**, adicione emails de teste (opcional)
8. Clique em **"Save and Continue"**

### 4. Criar Credenciais OAuth 2.0

1. Vá a **"APIs & Services"** → **"Credentials"**
2. Clique em **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Nome: `Organiza-te360 Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://seu-dominio.com
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/google/callback
   https://seu-dominio.com/api/google/callback
   ```
7. Clique em **"Create"**
8. **Copie o Client ID e Client Secret** (vão aparecer num popup)

### 5. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente ao seu projeto:

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
```

**Para produção**, altere o `GOOGLE_REDIRECT_URI` para o domínio real:
```bash
GOOGLE_REDIRECT_URI=https://seu-dominio.com/api/google/callback
```

### 6. Testar a Integração

1. Reinicie o servidor de desenvolvimento
2. Aceda a **Definições** na aplicação
3. Clique em **"Conectar Google Calendar"**
4. Autorize a aplicação
5. Teste importar/exportar eventos

## 🔒 Segurança

- **NUNCA** commite as credenciais no Git
- Use variáveis de ambiente ou serviços de secrets management
- Em produção, use HTTPS obrigatoriamente
- Revise periodicamente os acessos no Google Cloud Console

## 📚 Funcionalidades Implementadas

### Login com Google
- ✅ OAuth 2.0 flow completo
- ✅ Armazenamento seguro de tokens
- ✅ Refresh token automático

### Google Calendar
- ✅ Listar eventos do Google Calendar
- ✅ Importar eventos para o Organiza-te360
- ✅ Exportar eventos locais para Google Calendar
- ✅ Sincronização bidirecional
- ✅ Desconectar conta Google

## 🛠️ Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se o redirect URI está configurado corretamente no Google Cloud Console
- Certifique-se que a variável `GOOGLE_REDIRECT_URI` está correta

### Erro: "invalid_client"
- Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
- Confirme que as credenciais não expiraram

### Erro: "access_denied"
- O utilizador recusou a autorização
- Verifique os scopes solicitados

### Erro: "Google Calendar not connected"
- O utilizador precisa conectar primeiro em Definições
- Verifique se o token não expirou

## 📞 Suporte

Para mais informações, consulte:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)

