# Craftfolio API

Backend API for the Craftfolio portfolio application. Built with NestJS, Prisma, and PostgreSQL.

## Description

This project provides the API layer for Craftfolio: authentication, user management, and portfolio CRUD. It uses JWT for auth, class-validator for request validation, and Swagger for API documentation in development.

## Project setup

```bash
npm install
```

Copy `.env.sample` to `.env` and set your environment variables (database URL, JWT secret, etc.).

## Compile and run

```bash
# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

Default port is 3002 (overridable via `PORT`).

## Routes

- **/** – Project info and link to API docs
- **/swagger** – Swagger UI (development only)

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## Tech stack

- [NestJS](https://nestjs.com)
- [Prisma](https://www.prisma.io) with PostgreSQL
- [Passport](https://www.passportjs.org) (JWT, local)
- [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer)
- [Swagger](https://swagger.io) (OpenAPI)

## License

UNLICENSED (private).
