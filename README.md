# Valencia Charity App

Valencia Charity is a monorepo that helps people who have lost their homes
connect with resources and community support. The repository contains a Vite
React client application and a Cloudflare Workers API, all managed with
[Turborepo](https://turbo.build/repo).

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

Install dependencies at the root of the repository:

```bash
npm install
```

### Development

Run the development servers for all packages:

```bash
npm run dev
```

### Scripts

- `npm run build` – Build all applications.
- `npm run lint` – Lint source code.
- `npm run format` – Format source code and markdown files.

## Project Structure

- `apps/api` – Cloudflare Workers API using Hono and Drizzle ORM.
- `apps/client` – Vite + React frontend with Tailwind CSS.
- `models` – Shared TypeScript models.
