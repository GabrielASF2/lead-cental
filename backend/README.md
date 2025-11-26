# 🚀 Central de Leads API

API RESTful em Go para gerenciamento de leads e autenticação de usuários, construída com Gin Framework e PostgreSQL.

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Como Rodar](#-como-rodar)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação](#-autenticação)
- [Deploy](#-deploy)

## 🛠 Stack Tecnológica

- **Go** 1.24.2 - Linguagem de programação
- **Gin** - Framework web rápido e minimalista
- **PostgreSQL** - Banco de dados (via Neon/Supabase)
- **pgx/v5** - Driver PostgreSQL de alta performance
- **JWT** (golang-jwt/jwt/v5) - Autenticação via tokens
- **bcrypt** - Hash seguro de senhas
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
│       └── repository.go        # Camada de acesso ao banco
├── pkg/
│   └── database/
│       └── postgres.go          # Configuração de conexão com PostgreSQL
├── .gitignore
├── go.mod
├── go.sum
└── README.md
```

### Padrão de Arquitetura

- **cmd/** - Aplicações executáveis
- **internal/** - Código privado da aplicação (handlers, modelos, repositories)
- **pkg/** - Código reutilizável (database, utilities)

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
    created_at TIMESTAMP DEFAULT NOW()
);
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

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp env.example .env
```

Depois edite o arquivo `.env` com suas credenciais:

```env
DATABASE_URL=postgres://user:password@host:5432/database?sslmode=require
JWT_SECRET=seu_secret_super_secreto_aqui_troque_em_producao
PORT=8080
```

## 🔐 Variáveis de Ambiente

| Variável       | Descrição                                          | Obrigatória | Padrão |
| -------------- | -------------------------------------------------- | ----------- | ------ |
| `DATABASE_URL` | String de conexão PostgreSQL                       | ✅          | -      |
| `JWT_SECRET`   | Chave secreta para assinar tokens JWT             | ✅          | -      |
| `PORT`         | Porta onde o servidor irá rodar                    | ❌          | `8080` |

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

### Autenticação

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

### Rotas Protegidas

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

**Erros:**

- `401 Unauthorized` - Token ausente, inválido ou expirado

---

## 🔒 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação.

### Como funciona:

1. **Login**: Cliente envia email e senha para `/auth/login`
2. **Token**: API retorna um JWT válido por 24 horas
3. **Requisições**: Cliente envia o token no header `Authorization`
4. **Validação**: Middleware valida o token antes de acessar rotas protegidas

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

## 🌐 Deploy

### Render / Railway / Fly.io

1. **Configure as variáveis de ambiente** no painel da plataforma:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT` (geralmente autodetectado)

2. **Comando de build:**

```bash
go build -o api cmd/api/main.go
```

3. **Comando de start:**

```bash
./api
```

### Docker (Opcional)

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
CMD ["./api"]
```

---

## 📝 Notas de Segurança

- ✅ Senhas são armazenadas com **bcrypt** (hash seguro)
- ✅ Tokens JWT expiram em **24 horas**
- ✅ Middleware de autenticação protege rotas sensíveis
- ⚠️ **IMPORTANTE**: Troque o `JWT_SECRET` em produção por uma string aleatória forte
- ⚠️ Configure CORS adequadamente para aceitar apenas seu domínio frontend em produção

### Gerando um JWT_SECRET seguro:

```bash
openssl rand -base64 32
```

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

