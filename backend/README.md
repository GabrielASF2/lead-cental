# 🚀 Central de Leads API

API RESTful em Go para gerenciamento de leads e autenticação de usuários, construída com Gin Framework e PostgreSQL. **Arquitetura SaaS Multi-Tenant com Schema Dinâmico.**

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura Multi-Tenant](#-arquitetura-multi-tenant)
- [Configuração](#-configuração)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Como Rodar](#-como-rodar)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação](#-autenticação)
- [Segurança](#-segurança)
- [Deploy](#-deploy)

## 🛠 Stack Tecnológica

- **Go** 1.24.2 - Linguagem de programação
- **Gin** - Framework web rápido e minimalista
- **PostgreSQL** - Banco de dados (via Neon/Supabase)
- **pgx/v5** - Driver PostgreSQL de alta performance
- **JWT** (golang-jwt/jwt/v5) - Autenticação via tokens
- **bcrypt** - Hash seguro de senhas
- **AES-256** - Criptografia de credenciais sensíveis
- **godotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
backend/
├── cmd/
│   └── api/
│       └── main.go              # Ponto de entrada da aplicação
├── internal/
│   ├── auth/
│   │   └── handler.go           # Handlers de registro e login
│   ├── middleware/
│   │   └── auth_guard.go        # Middleware de autenticação JWT
│   └── user/
│       ├── model.go             # Modelos de dados do usuário
│       ├── repository.go        # Camada de acesso ao banco
│       └── handler.go           # ⭐ NOVO: Handlers de configuração Supabase
├── pkg/
│   ├── crypto/
│   │   └── crypto.go            # ⭐ NOVO: Criptografia AES-256
│   └── database/
│       └── postgres.go          # Configuração de conexão com PostgreSQL
├── .env.example
├── .gitignore
├── go.mod
├── go.sum
└── README.md
```

### Padrão de Arquitetura

- **cmd/** - Aplicações executáveis
- **internal/** - Código privado da aplicação (handlers, modelos, repositories)
- **pkg/** - Código reutilizável (database, crypto, utilities)

## 🌐 Arquitetura Multi-Tenant

Esta API suporta **múltiplos clientes (tenants)**, onde cada cliente conecta seu próprio Supabase. O sistema:

1. ✅ Armazena credenciais do Supabase **criptografadas** por usuário
2. ✅ Detecta automaticamente o schema da tabela de leads do cliente
3. ✅ Isola completamente os dados entre clientes
4. ✅ Permite schemas diferentes para cada cliente

**Fluxo:**
```
Cliente cadastra → Configura Supabase → Sistema detecta schema → Frontend se adapta
```

Veja documentação completa em: [ARQUITETURA_SAAS_DINAMICA.md](../ARQUITETURA_SAAS_DINAMICA.md)

## ⚙️ Configuração

### Pré-requisitos

- Go 1.24+ instalado
- PostgreSQL (ou conta no Neon/Supabase)
- Git

### Banco de Dados

A API espera uma tabela `users` com a seguinte estrutura:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- ⭐ NOVOS CAMPOS (Multi-Tenant)
    supabase_url TEXT,
    supabase_anon_key TEXT,
    supabase_configured BOOLEAN DEFAULT false,
    leads_table_name VARCHAR(255) DEFAULT 'leads',
    leads_schema JSONB,
    schema_detected_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

## 📦 Instalação

1. **Clone o repositório:**

```bash
git clone <seu-repositorio>
cd lead-central/backend
```

2. **Instale as dependências:**

```bash
go mod download
```

3. **Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DATABASE_URL=postgres://user:password@host:5432/database?sslmode=require
JWT_SECRET=seu_secret_super_secreto_aqui_troque_em_producao
ENCRYPTION_KEY=c02895eeef8b92b427b7a34592a7b32d
PORT=8080
```

## 🔐 Variáveis de Ambiente

| Variável         | Descrição                                          | Obrigatória | Padrão |
| ---------------- | -------------------------------------------------- | ----------- | ------ |
| `DATABASE_URL`   | String de conexão PostgreSQL                       | ✅          | -      |
| `JWT_SECRET`     | Chave secreta para assinar tokens JWT             | ✅          | -      |
| `ENCRYPTION_KEY` | ⭐ Chave AES-256 (32 caracteres hex)              | ✅          | -      |
| `PORT`           | Porta onde o servidor irá rodar                    | ❌          | `8080` |

### Como Gerar ENCRYPTION_KEY:

```bash
openssl rand -hex 16
```

**Resultado:** `c02895eeef8b92b427b7a34592a7b32d` (32 caracteres)

### Exemplo de DATABASE_URL (Neon):

```
postgres://usuario:senha@ep-exemplo-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 🚀 Como Rodar

### Desenvolvimento Local

```bash
# Na pasta backend/
go run cmd/api/main.go
```

O servidor estará disponível em: `http://localhost:8080`

### Build para Produção

```bash
# Compila o binário otimizado
go build -o api cmd/api/main.go

# Executa o binário
./api
```

### Verificar se está rodando

```bash
curl http://localhost:8080/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "central-leads-api"
}
```

## 🔌 Endpoints da API

### Health Check

```http
GET /health
```

Verifica se o serviço está ativo.

**Resposta:**

```json
{
  "status": "ok",
  "service": "central-leads-api"
}
```

---

### Autenticação (Públicas)

#### Registrar Novo Usuário

```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Resposta (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "role": "admin",
  "created_at": "2025-11-26T10:30:00Z"
}
```

**Validações:**

- `name` - obrigatório
- `email` - obrigatório, formato válido
- `password` - obrigatório, mínimo 6 caracteres

---

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Resposta (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "role": "admin",
    "created_at": "2025-11-26T10:30:00Z"
  }
}
```

**Erros possíveis:**

- `401 Unauthorized` - Credenciais inválidas
- `400 Bad Request` - Dados inválidos

---

### Rotas Protegidas (Requerem JWT)

#### Verificar Autenticação

```http
GET /api/me
Authorization: Bearer <seu-token-jwt>
```

**Resposta (200 OK):**

```json
{
  "message": "Você está autenticado e tem acesso a área restrita."
}
```

---

#### ⭐ Configurar Supabase do Cliente

```http
POST /api/configure-supabase
Authorization: Bearer <seu-token-jwt>
Content-Type: application/json

{
  "supabase_url": "https://xxx.supabase.co",
  "supabase_anon_key": "eyJhbGc...",
  "table_name": "leads",
  "schema": {
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
      }
    ],
    "detectedAt": "2025-11-26T10:30:00Z"
  }
}
```

**Resposta (200 OK):**

```json
{
  "message": "Supabase configurado com sucesso"
}
```

**O que faz:**
- Salva URL e Anon Key (criptografada) do Supabase do cliente
- Armazena schema detectado da tabela
- Marca usuário como configurado

---

#### ⭐ Buscar Configuração do Supabase

```http
GET /api/user/supabase-config
Authorization: Bearer <seu-token-jwt>
```

**Resposta (200 OK):**

```json
{
  "supabase_url": "https://xxx.supabase.co",
  "supabase_anon_key": "eyJhbGc...",
  "leads_table_name": "leads",
  "leads_schema": {
    "columns": [
      {
        "name": "nome",
        "type": "text",
        "nullable": false,
        "label": "Nome"
      }
    ]
  }
}
```

**Erros:**

- `404 Not Found` - Usuário não configurou Supabase ainda
- `401 Unauthorized` - Token inválido

---

## 🔒 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação.

### Como funciona:

1. **Login**: Cliente envia email e senha para `/auth/login`
2. **Token**: API retorna um JWT válido por 24 horas
3. **Requisições**: Cliente envia o token no header `Authorization`
4. **Validação**: Middleware valida o token e injeta claims no contexto

### Estrutura do Token JWT:

```json
{
  "sub": "user-id-uuid",
  "role": "admin",
  "exp": 1732627200
}
```

### Usando o Token:

```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
     http://localhost:8080/api/me
```

---

## 🔐 Segurança

### Criptografia de Credenciais

- ✅ `supabase_anon_key` criptografada com **AES-256-GCM**
- ✅ Chave de criptografia em variável de ambiente
- ✅ Nunca exposta em logs ou respostas API
- ✅ Descriptografada apenas quando necessário

### Senha dos Usuários

- ✅ Senhas armazenadas com **bcrypt** (hash seguro)
- ✅ Custo adaptativo de hashing
- ✅ Salt único por senha

### JWT

- ✅ Tokens JWT expiram em **24 horas**
- ✅ Assinados com HMAC-SHA256
- ✅ Validação em todas as rotas protegidas

### Isolamento Multi-Tenant

- ✅ Cada usuário acessa apenas seus próprios dados
- ✅ Claims do JWT identificam o usuário
- ✅ Queries SQL sempre filtradas por `user_id`

### Recomendações para Produção:

```bash
# Gere secrets fortes:
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 16)
```

⚠️ **NUNCA** commite os arquivos `.env` no Git!

---

## 🌐 Deploy

### Render / Railway / Fly.io

1. **Configure as variáveis de ambiente** no painel da plataforma:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ENCRYPTION_KEY` ⭐
   - `PORT` (geralmente autodetectado)

2. **Comando de build:**

```bash
go build -o api cmd/api/main.go
```

3. **Comando de start:**

```bash
./api
```

### Docker

```dockerfile
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o api cmd/api/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/api .
EXPOSE 8080
CMD ["./api"]
```

**Build e Run:**

```bash
docker build -t central-leads-api .
docker run -p 8080:8080 --env-file .env central-leads-api
```

---

## 🧪 Testando a API

### Fluxo Completo

```bash
# 1. Registrar usuário
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'

# 2. Fazer login (copie o token)
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'

# 3. Configurar Supabase
curl -X POST http://localhost:8080/api/configure-supabase \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supabase_url": "https://xxx.supabase.co",
    "supabase_anon_key": "eyJhbGc...",
    "table_name": "leads",
    "schema": {...}
  }'

# 4. Buscar configuração
curl -X GET http://localhost:8080/api/user/supabase-config \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📚 Documentação Adicional

- [ARQUITETURA_SAAS_DINAMICA.md](../ARQUITETURA_SAAS_DINAMICA.md) - Arquitetura completa
- [MERGE_REQUEST.md](../MERGE_REQUEST.md) - Detalhes da implementação

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e de uso interno.

---

## 📧 Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

---

**✨ Desenvolvido com Go e ❤️**
