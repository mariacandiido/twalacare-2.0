# Backend ProjectoMC / TwalaCare

API REST em **Node.js**, **Express** e **MySQL** para a plataforma de farmácias (frontend já existente). Inclui autenticação JWT, gestão de utilizadores (cliente, farmácia, entregador, admin), farmácias, medicamentos, pedidos, entregas e receitas.

---

## 1. Arquitetura

Foi adoptada uma **arquitetura em camadas** (Controllers → Services → Repositories) com organização **modular** por domínio:

- **Controllers**: recebem a requisição, validam (express-validator), chamam o Service e devolvem a resposta.
- **Services**: regras de negócio e orquestração (ex.: criar pedido + itens + entrega).
- **Repositories**: acesso a dados (Sequelize); um repositório por entidade principal.
- **Models**: definição dos modelos Sequelize e associações em `src/database/index.js`.

Benefícios: separação de responsabilidades, testes mais fáceis (mock de repositórios), evolução por módulos (auth, farmacias, pedidos, etc.).

---

## 2. Estrutura de pastas

```
backend/
├── src/
│   ├── config/           # database, jwt, server, cors, logger
│   ├── controllers/       # handlers HTTP por recurso
│   ├── services/         # lógica de negócio
│   ├── repositories/     # acesso a dados (Sequelize)
│   ├── models/           # User, Farmacia, Medicamento, Pedido, etc.
│   ├── routes/           # rotas por módulo (auth, users, farmacias, ...)
│   ├── middlewares/      # auth (JWT), validate, errorHandler
│   ├── validators/       # regras express-validator (auth, etc.)
│   ├── utils/            # asyncHandler, etc.
│   ├── database/
│   │   ├── migrations/   # criação de tabelas
│   │   ├── seeders/      # dados iniciais (ex.: admin)
│   │   └── schema.sql    # script SQL completo (referência)
│   ├── docs/             # swagger.js (OpenAPI)
│   └── app.js             # Express: middlewares + rotas + erro global
├── tests/                # Jest + Supertest (auth, health)
├── example.env            # variáveis de ambiente (copiar para .env)
├── package.json
├── server.js              # entrada: dotenv + app.listen
├── .sequelizerc           # paths do Sequelize CLI
├── jest.config.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 3. Configuração

- **MySQL**: `src/config/database.js` (development/test/production). Variáveis: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`.
- **Servidor**: `src/config/server.js` (PORT, NODE_ENV).
- **JWT**: `src/config/jwt.js` (JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_*).
- **CORS**: `src/config/cors.js` (CORS_ORIGIN em lista).
- **Logs**: `src/config/logger.js` (Winston); Morgan em `app.js` para HTTP.

Copiar `example.env` para `.env` e preencher (em especial `JWT_SECRET` e `JWT_REFRESH_SECRET` em produção).

---

## 4. Banco de dados (MySQL)

Diagrama lógico resumido:

- **users**: id, nome, email, password_hash, telefone, tipo (cliente|farmacia|entregador|admin), status, endereço, etc.
- **farmacias**: id, user_id (FK), nome, nif, endereço, horários, aprovada, data_aprovacao, rejeitada, motivo_rejeicao.
- **medicamentos**: id, farmacia_id (FK), nome, categoria, preco, stock, requires_prescription, ativo.
- **pedidos**: id, cliente_id (FK), subtotal, taxa_entrega, total, status, metodo_pagamento, endereco_entrega, datas.
- **pedido_itens**: id, pedido_id, medicamento_id, farmacia_id, nome, preco_unitario, quantidade.
- **entregas**: id, pedido_id (FK), entregador_id (FK users), status, valor_entrega.
- **receitas**: id, cliente_id, pedido_id, farmacia_id, ficheiro_url, estado (pendente|aprovada|rejeitada).
- **refresh_tokens**: id, user_id, token, expires_at, revoked.

Script completo: `src/database/schema.sql`. Em desenvolvimento use as migrations:

```bash
npm run migrate
npm run seed
```

---

## 5. Autenticação

- **Registo**: `POST /api/auth/register` (body: nome, email, password, tipo, telefone, etc.). Farmácia/entregador ficam `pendente_aprovacao`.
- **Login**: `POST /api/auth/login` (body: identifier [email ou telefone], password, tipo). Resposta: `user`, `token`, `refreshToken`.
- **Refresh**: `POST /api/auth/refresh` (body: refreshToken).
- **Logout**: `POST /api/auth/logout` (body: refreshToken opcional).
- **Me**: `GET /api/auth/me` (header `Authorization: Bearer <token>`).
- **Check email**: `GET /api/auth/check-email?email=...`

Senhas com **bcrypt** (12 rounds). Rotas protegidas usam o middleware `authenticate`; `requireRoles(['admin'])` ou `['farmacia','admin']` para restringir por tipo.

---

## 6. API REST – Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST   | /api/auth/register | Registo |
| POST   | /api/auth/login    | Login |
| POST   | /api/auth/refresh   | Renovar token |
| GET    | /api/auth/me        | Perfil (auth) |
| GET    | /api/users          | Listar utilizadores (admin) |
| GET    | /api/users/me       | Meu perfil; PATCH atualizar |
| GET    | /api/farmacias      | Listar farmácias aprovadas (público) |
| GET    | /api/farmacias/:id  | Detalhe farmácia |
| GET    | /api/farmacias/admin/pendentes | Pendentes (admin) |
| POST   | /api/farmacias/admin/:id/aprovar | Aprovar (admin) |
| GET    | /api/medicamentos   | Listar (query: categoria, provincia, busca) |
| GET    | /api/medicamentos/:id | Detalhe |
| POST   | /api/medicamentos   | Criar (farmácia/admin) |
| POST   | /api/pedidos        | Criar pedido (cliente) |
| GET    | /api/pedidos/me     | Meus pedidos (cliente) |
| GET    | /api/pedidos/farmacia | Pedidos da farmácia (farmácia) |
| PATCH  | /api/pedidos/:id/status | Atualizar status |
| GET    | /api/entregas/disponiveis | Entregas disponíveis (entregador) |
| GET    | /api/entregas/me    | Minhas entregas (entregador) |
| POST   | /api/entregas/:id/aceitar | Aceitar entrega (entregador) |
| POST   | /api/receitas       | Enviar receita (cliente) |
| GET    | /api/receitas/me    | Minhas receitas (cliente) |
| GET    | /api/receitas/farmacia | Receitas da farmácia (farmácia) |
| PATCH  | /api/receitas/:id/estado | Aprovar/rejeitar (farmácia) |

Respostas de sucesso: `{ status: 'success', data: { ... } }`. Erros: `{ status: 'error', message: '...' }` (e opcionalmente `details`).

---

## 7. Validação e segurança

- **express-validator** em rotas de auth (registro, login, refresh, check-email); middleware `validate` devolve 400 com lista de erros.
- **bcrypt** para senhas.
- **Helmet** para headers HTTP seguros.
- **express-rate-limit** (configurável por RATE_LIMIT_*).
- **CORS** restrito a origens em `CORS_ORIGIN`.
- **Protecção SQL**: Sequelize usa parâmetros; não concatenar SQL.
- **JWT** em header `Authorization: Bearer <token>`; não expor dados sensíveis no payload.

---

## 8. Logs e erros

- **Winston**: níveis info, error, http (Morgan encaminha para logger).
- **Middleware global de erro** em `src/middlewares/errorHandler.js`: respostas padronizadas; em produção pode ocultar stack.

---

## 9. Scripts

```bash
npm start          # Produção
npm run dev        # Desenvolvimento (nodemon)
npm test           # Jest
npm run migrate    # Executar migrations
npm run seed       # Executar seeders
```

---

## 10. Documentação e testes

- **Swagger**: após subir o servidor, abrir `http://localhost:3000/api-docs`.
- **Testes**: `tests/auth.test.js` (exemplos com Supertest). Configuração em `jest.config.js` e `tests/setup.js`.

---

## 11. Deploy e produção

- **Docker**: `Dockerfile` para a API; `docker-compose.yml` sobe API + MySQL (desenvolvimento). Em produção use um MySQL gerido ou container separado.
- **Variáveis**: definir em produção `NODE_ENV=production`, `JWT_SECRET` e `JWT_REFRESH_SECRET` fortes, `DB_*` e `CORS_ORIGIN` correctos.
- **VPS/Cloud**: instalar Node 18+, MySQL 8, configurar reverse proxy (nginx) e PM2 ou systemd para o processo Node.

---

## 12. Escalabilidade futura

- **Redis**: cache de sessões ou rate limit; cache de listagens (ex.: farmácias aprovadas).
- **Filas (ex.: RabbitMQ)**: processar notificações, geração de PDFs, emails.
- **Microserviços**: separar auth, pedidos, entregas em serviços distintos.
- **CDN**: assets e imagens (ex.: receitas, logos).

---

## 13. Integração com o frontend

Base URL da API (ex.: `http://localhost:3000/api`). No frontend (Vite), definir por exemplo:

```env
VITE_API_URL=http://localhost:3000/api
```

Exemplo de resposta de login para o frontend:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "nome": "Maria Cliente",
      "email": "cliente@gmail.com",
      "telefone": "+244 900 000 001",
      "tipo": "cliente",
      "status": "ativo",
      "dataRegistro": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "7d"
  }
}
```

O frontend deve enviar em requisições protegidas o header:

```
Authorization: Bearer <token>
```

Em caso de 401 (token expirado), usar o `refreshToken` em `POST /api/auth/refresh` e guardar o novo `token` e `refreshToken`.
