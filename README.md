# Craftfolio API

Backend API for the Craftfolio portfolio application. Built with **NestJS** and **Prisma** (PostgreSQL).

## Description

This project provides the API layer for Craftfolio: authentication, user management, and portfolio CRUD. 
It uses JWT for auth, class-validator for request validation, and Swagger for API documentation in 
development.

## Prisma

This project uses [Prisma](https://www.prisma.io) as the ORM. The schema and database setup are Prisma-centric.

### Schema

- **Location:** `prisma/schema.prisma`
- **Models:** `User`, `Portfolio` (with `Status` enum: `ACTIVE`, `INACTIVE`, `DELETED`)
- **Database:** PostgreSQL (connection via `DATABASE_URL`)

### Prisma setup

1. Copy `.env.sample` to `.env` and set `DATABASE_URL` (and other vars such as `JWT_SECRET`).

2. Install dependencies and generate the Prisma client:

   ```bash
   npm install
   npx prisma generate
   ```

3. Run migrations (creates/updates the database):

   ```bash
   npx prisma migrate dev
   ```

4. (Optional) Open Prisma Studio to inspect or edit data:

   ```bash
   npx prisma studio
   ```

### App integration

- **PrismaModule** (`src/modules/prisma/`) provides `PrismaService` (NestJS injectable) used by auth, users, and portfolios.
- **PrismaExceptionFilter** (`src/common/exceptions/prisma.exception.ts`) maps Prisma errors (e.g. unique constraint, validation) to HTTP responses.

## Run the API

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

Default port is `3002` (override with `PORT`).

## Routes

- **/** – Project info and link to API docs
- **/swagger** – Swagger UI (development only)

## Tests

```bash
npm run test          # unit
npm run test:e2e      # e2e
npm run test:cov      # coverage
```

## Tech stack

- [NestJS](https://nestjs.com)
- [Prisma](https://www.prisma.io) with PostgreSQL
- [Passport](https://www.passportjs.org) (JWT, local)
- [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer)
- [Swagger](https://swagger.io) (OpenAPI)

## License

UNLICENSED (private).
