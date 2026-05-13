# API Clientes e Pedidos

API REST para gerenciamento de clientes e pedidos com autenticação JWT e controle de roles (admin/user).

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js |
| Framework | Fastify 5 |
| ORM | Drizzle ORM |
| Banco | PostgreSQL |
| Validação | Zod |
| Autenticação | JWT + bcryptjs |
| Documentação | Swagger + ScalarUI |
| Linter | Biome |
| Testes | Vitest |
| Pacotes | pnpm |
| Linguagem | TypeScript |

## Pré-requisitos

- Node.js 20+
- pnpm
- PostgreSQL 15+
- Docker (opcional)

## Instalação

```bash
# Instalar dependências
pnpm install

# Copiar variáveis ambiente
cp .env.example .env

# Editar .env com suas configurações
# DATABASE_URL=postgresql://usuario:senha@localhost:5432/api_teste
# JWT_SECRET=seu-segredo-aqui
# PORT=5173
```

## Banco de Dados

```bash
# Gerar migrations
pnpm db:generate

# Aplicar migrations
pnpm db:push

# (Opcional) Abrir Drizzle Studio para visualizar dados
pnpm db:studio
```

## Execução

```bash
# Desenvolvimento (com hot reload)
pnpm dev

# Build
pnpm build

# Produção
pnpm start
```

A API estará disponível em `http://localhost:5173`.

## Documentação Interativa

Com o servidor rodando, acesse:

- **ScalarUI**: http://localhost:5173/api-docs

## Testes

```bash
# Executar testes
pnpm test

# Modo watch
pnpm test:watch
```

## Lint

```bash
# Verificar código
pnpm lint:check

# Corrigir automaticamente
pnpm lint
```

## Docker

```bash
# Construir a imagem
docker-compose build

# Subir os containers
docker-compose up

# Executar em background
docker-compose up -d

# Parar os containers
docker-compose down

# Parar e remover volumes (limpa o banco de dados)
docker-compose down -v
```

ℹ️ O banco PostgreSQL não persiste dados após `docker-compose down -v`. Remova a flag `-v` para manter os dados.

## Endpoints

### Auth (Autenticação)

#### POST /auth/register
Cadastro de novo cliente.

**Body:**
```json
{
  "cpf": "12345678901",
  "rg": "MG123456",
  "nome": "João Silva",
  "idade": 30,
  "email": "joao@email.com",
  "login": "joaosilva",
  "senha": "123456"
}
```

**Resposta (201):**
```json
{
  "id": "uuid",
  "cpf": "12345678901",
  "rg": "MG123456",
  "nome": "João Silva",
  "idade": 30,
  "email": "joao@email.com",
  "login": "joaosilva",
  "role": "user",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### POST /auth/login
Autentica usuário e retorna JWT.

**Body:**
```json
{
  "login": "joaosilva",
  "senha": "123456"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@email.com",
    "login": "joaosilva",
    "role": "user"
  }
}
```

### Users (Usuários) — Requer autenticação

#### GET /users
Lista todos os usuários.

**Header:** `Authorization: Bearer <token>`

#### PUT /users/:id
Atualiza dados cadastrais. **Login não pode ser alterado.**

**Se o usuário não for admin, somente o usuário do mesmo `:id` pode alterar suas próprias informações.**

**Header:** `Authorization: Bearer <token>`

**Body (um ou mais campos):**
```json
{
  "nome": "João Silva Atualizado",
  "email": "joao.novo@email.com"
}
```

#### DELETE /users/:id
Exclui um usuário. **Apenas ADMIN.**

**Header:** `Authorization: Bearer <token>`
**Role necessária:** `admin`

### Orders (Pedidos) — Requer autenticação

#### POST /orders
Cria um pedido vinculado a um usuário.

**Header:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "userId": "uuid-do-usuario",
  "descricao": "Headset"
}
```

#### GET /orders
Lista todos os pedidos com nome do usuário.

**Header:** `Authorization: Bearer <token>`

#### GET /orders/user/:userId
Lista pedidos de um usuário específico.

**Header:** `Authorization: Bearer <token>`

## Estrutura do Projeto

```
api-teste/
├── drizzle/                      # Migrations
├── src/
│   ├── config/
│   │   └── env.ts                # Validação de variáveis ambiente
│   ├── db/
│   │   ├── index.ts              # Conexão com PostgreSQL
│   │   └── schema/
│   │       ├── index.ts          # Re-exports
│   │       ├── users.ts          # Schema da tabela users
│   │       └── orders.ts         # Schema da tabela orders
│   ├── modules/
│   │   ├── _errors/              # Construtores de erros globais
│   │   │   ├── bad-request-error.ts
│   │   │   └── not-found-error.ts
│   │   ├── auth/                 # Cadastro e login
│   │   │   ├── auth.schema.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   ├── users/                # CRUD de usuários
│   │   │   ├── users.schema.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.ts
│   │   │   └── users.routes.ts
│   │   └── orders/               # Pedidos
│   │       ├── orders.schema.ts
│   │       ├── orders.service.ts
│   │       ├── orders.controller.ts
│   │       └── orders.routes.ts
│   ├── shared/
│   │   └── middleware/
│   │       └── auth.ts           # JWT + role verification
│   ├── app.ts                    # Fastify instance + plugins
│   ├── error-handler.ts          # Handler, resposta da API para erros
│   └── server.ts                 # Entry point
├── tests/
│   └── modules/
│       ├── auth.service.test.ts
│       ├── users.service.test.ts
│       └── orders.service.test.ts
├── .env / .env.example
├── biome.json
├── docker-compose.yml
├── docker-entrypoint.sh
├── Dockerfile
├── drizzle.config.ts
├── tsconfig.json
├── vitest.config.ts
├── package.json
└── README.md
```

## Regras de Negócio

- **CPF, email e login** são únicos no sistema
- **Login** não pode ser alterado após o cadastro
- **Idade mínima** para cadastro: 18 anos
- **Senha** armazenada com hash bcrypt
- **Roles:** `admin` e `user` (padrão)
- **Exclusão de usuário:** apenas usuários com role `admin`
- **Pedidos** são vinculados a um usuário existente (FK com cascade)
