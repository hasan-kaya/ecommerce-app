# E-Commerce Application

E-commerce platform built with modern web technologies.

## Tech Stack

**Backend (monolith-api)**

- Node.js with Express
- GraphQL API with Apollo Server
- TypeORM with PostgreSQL
- Redis for caching and rate limiting
- OIDC Provider for authentication

**Frontend (web-client)**

- Next.js 16 with React 19
- Apollo Client for GraphQL
- NextAuth for authentication
- Tailwind CSS for styling
- Formik and Yup for forms

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Installation

1. Clone the repository
2. Start the services with Docker:

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Testing

**Backend Tests**

Run API tests with k6:

```bash
cd monolith-api
npm test
```

**Frontend E2E Tests**

Run end-to-end tests with Playwright:

```bash
cd web-client
npm run test:e2e
```
