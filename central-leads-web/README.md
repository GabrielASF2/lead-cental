# 🎨 Central de Leads - Frontend

Interface moderna em Next.js 15 para gerenciamento de leads com **arquitetura SaaS multi-tenant** e **detecção automática de schema**.

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura Multi-Tenant](#-arquitetura-multi-tenant)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Como Rodar](#-como-rodar)
- [Componentes](#-componentes)
- [Rotas](#-rotas)
- [Deploy](#-deploy)

## 🛠 Stack Tecnológica

- **Next.js 15.1.3** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Tailwind CSS 3.4.1** - Estilização
- **Supabase** - Cliente dinâmico (um por usuário)
- **lucide-react** - Ícones
- **jsonwebtoken** - Decodificação de JWT
- **Server Actions** - Mutations no servidor

## ✨ Funcionalidades

### Autenticação
- ✅ Login com JWT
- ✅ Registro de usuários
- ✅ Proteção de rotas
- ✅ Cookies HTTP-only

### Multi-Tenant SaaS
- ✅ **Cada cliente conecta seu próprio Supabase**
- ✅ **Detecção automática de schema da tabela**
- ✅ **Interface adapta-se dinamicamente ao schema**
- ✅ Isolamento completo de dados por usuário
- ✅ Criptografia de credenciais

### Dashboard Dinâmico
- ✅ Tabela que renderiza qualquer schema
- ✅ Formatação inteligente de campos:
  - 📱 Telefone → Botão WhatsApp
  - 📧 Email → Link mailto
  - 🏷️ Campanha/Status → Badge
  - 📅 Timestamps → Data formatada BR
  - 👤 Nome → Negrito
- ✅ KPIs dinâmicos
- ✅ Responsivo

### Configurações
- ✅ Página de configuração do Supabase
- ✅ Validação de credenciais
- ✅ Feedback visual de schema detectado
- ✅ Loading states e error handling

## 🌐 Arquitetura Multi-Tenant

Esta aplicação **não tem um Supabase fixo**. Cada usuário conecta o seu:

```
┌─────────────────────────────────────────┐
│ Cliente A → Supabase A (schema X)       │
│ Cliente B → Supabase B (schema Y)       │
│ Cliente C → Supabase C (schema Z)       │
└─────────────────────────────────────────┘
             ↓
    Sistema se adapta a TODOS!
```

**Fluxo:**
1. Usuário faz login
2. Configura Supabase em `/settings`
3. Sistema detecta schema automaticamente
4. Dashboard renderiza tabela dinâmica

Documentação completa: [ARQUITETURA_SAAS_DINAMICA.md](../ARQUITETURA_SAAS_DINAMICA.md)

## 📁 Estrutura do Projeto

```
central-leads-web/
├── app/
│   ├── api/
│   │   └── configure-supabase/
│   │       └── route.ts           # API Route para config Supabase
│   ├── components/
│   │   ├── DynamicLeadsTable/     # ⭐ Tabela dinâmica
│   │   │   ├── DynamicLeadsTable.tsx
│   │   │   ├── DynamicTableHeader.tsx
│   │   │   └── DynamicTableRow.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── FormField.tsx
│   │   ├── Header.tsx
│   │   ├── WhatsAppButton.tsx
│   │   └── index.ts
│   ├── dashboard/
│   │   └── page.tsx               # Dashboard com tabela dinâmica
│   ├── login/
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── register/
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── settings/                  # ⭐ NOVO
│   │   └── page.tsx               # Configuração do Supabase
│   ├── layout.tsx
│   ├── page.tsx                   # Landing page
│   └── globals.css
├── lib/
│   ├── schema-detector.ts         # ⭐ Detector de schema
│   ├── format-utils.tsx           # ⭐ Formatação inteligente
│   └── supabase.ts
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd lead-central/central-leads-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
JWT_SECRET=mesmo-secret-do-backend
```

## ⚙️ Variáveis de Ambiente

| Variável              | Descrição                        | Obrigatória | Padrão              |
| --------------------- | -------------------------------- | ----------- | ------------------- |
| `NEXT_PUBLIC_API_URL` | URL da API Go                    | ✅          | -                   |
| `JWT_SECRET`          | Secret para validar JWT (Server) | ✅          | -                   |

**Nota:** `NEXT_PUBLIC_*` são expostas no cliente. `JWT_SECRET` só é usado server-side.

## 🚀 Como Rodar

### Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## 🎨 Componentes

### Componentes Base

- **Button** - Botão reutilizável (5 variantes)
- **Badge** - Tag colorida (4 variantes)
- **Input** - Input com label e erro
- **FormField** - Input completo com ícone
- **Card** - Container estilizado
- **ErrorMessage** - Mensagem de erro

### Componentes de Layout

- **Header** - Header com logo e ações
- **AuthCard** - Card para login/registro
- **KPICard** - Card de métricas

### Componentes Específicos

- **WhatsAppButton** - Botão clicável para WhatsApp
- **DynamicLeadsTable** ⭐ - Tabela que se adapta a qualquer schema

## 🗺️ Rotas

### Públicas

- `/` - Landing page
- `/login` - Autenticação
- `/register` - Cadastro

### Protegidas (Requerem Login)

- `/dashboard` - Dashboard principal com tabela dinâmica
- `/settings` ⭐ - Configuração do Supabase

## 🔧 Configuração do Supabase

### Passo a Passo

1. **Faça login** no sistema
2. Acesse **`/settings`**
3. Cole suas credenciais:
   - URL do projeto (ex: `https://xxx.supabase.co`)
   - Anon Key (pública)
   - Nome da tabela (padrão: `leads`)
4. Clique em **"Salvar Configuração"**
5. Sistema detecta schema automaticamente
6. Vá para **`/dashboard`** e veja seus dados!

### Como Obter Credenciais

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Copie:
   - **Project URL**
   - **anon public key**

### ⚠️ Importante: RLS (Row Level Security)

Se sua tabela tiver RLS ativo, você precisa criar uma política:

```sql
-- Permitir leitura pública
CREATE POLICY "Enable read access for all users" 
ON leads 
FOR SELECT 
USING (true);
```

Caso contrário, o sistema não conseguirá ler os dados.

## 🎯 Detecção de Schema

O sistema detecta automaticamente:

- ✅ **Tipos de dados** (text, uuid, timestamp, integer, etc)
- ✅ **Nullable** (campos opcionais)
- ✅ **Primary Key** (geralmente `id`)
- ✅ **Labels** (created_at → "Created At")

**Exemplo de Schema Detectado:**

```json
{
  "columns": [
    {
      "name": "id",
      "type": "uuid",
      "nullable": false,
      "isPrimaryKey": true,
      "label": "ID"
    },
    {
      "name": "nome",
      "type": "text",
      "nullable": false,
      "label": "Nome"
    },
    {
      "name": "telefone",
      "type": "text",
      "nullable": true,
      "label": "Telefone"
    }
  ]
}
```

## 📊 Formatação Inteligente

O sistema formata células automaticamente baseado no **nome** e **tipo** da coluna:

| Detecta                     | Renderiza                 |
| --------------------------- | ------------------------- |
| `telefone/whatsapp/phone`   | Botão WhatsApp clicável   |
| `email`                     | Link mailto               |
| `campanha/status/categoria` | Badge azul                |
| `produto/interesse`         | Badge cinza               |
| `created_at/timestamp`      | Data BR (dd/mm hh:mm)     |
| `nome/name`                 | Texto em negrito          |
| Outros                      | Texto normal              |

## 🌐 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório** no [Vercel](https://vercel.com)
2. **Configure as variáveis de ambiente:**
   - `NEXT_PUBLIC_API_URL`
   - `JWT_SECRET`
3. **Deploy automático** a cada push!

### Netlify

```bash
npm run build
```

Configure:
- Build command: `npm run build`
- Publish directory: `.next`

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Segurança

- ✅ **JWT em cookies HTTP-only** (não acessível via JavaScript)
- ✅ **Server Components** para dados sensíveis
- ✅ **Type safety** com TypeScript
- ✅ **Validação de inputs** client-side e server-side
- ✅ **HTTPS** obrigatório em produção

## 🧪 Testando Localmente

### 1. Rodar Backend

```bash
cd ../backend
go run cmd/api/main.go
```

### 2. Rodar Frontend

```bash
cd central-leads-web
npm run dev
```

### 3. Testar Fluxo

```
1. http://localhost:3000/register
   → Criar conta
   
2. http://localhost:3000/login
   → Fazer login
   
3. http://localhost:3000/settings
   → Configurar Supabase
   → Detectar schema
   
4. http://localhost:3000/dashboard
   → Ver tabela dinâmica com seus dados!
```

## 📚 Documentação Adicional

- [ARQUITETURA_SAAS_DINAMICA.md](../ARQUITETURA_SAAS_DINAMICA.md) - Arquitetura completa
- [MERGE_REQUEST.md](../MERGE_REQUEST.md) - Detalhes da implementação
- [Backend README](../backend/README.md) - Documentação da API

## 🎨 Customização

### Cores (Tailwind)

Cores principais definidas em `tailwind.config.ts`:

- `blue-600` - Primary
- `slate-900` - Dark
- `red-600` - Danger
- `green-600` - Success

### Componentes

Todos os componentes estão em `app/components/` e são facilmente customizáveis.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso interno.

---

## 🎉 Diferenciais

### Antes (Schema Fixo)
```typescript
// Cliente OBRIGADO a ter esses campos
interface Lead {
  name: string
  email: string
  whatsapp: string
}
```

### Depois (Schema Dinâmico)
```typescript
// Sistema se adapta a QUALQUER schema!
interface DynamicLeadsTableProps {
  schema: ColumnSchema[]  // Detectado automaticamente
  data: Record<string, any>[]
}
```

**Resultado:** SaaS verdadeiramente flexível e enterprise-grade! 🚀

---

**✨ Built with Next.js and ❤️**
