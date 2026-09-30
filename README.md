# Bank App Node API Backend

A TypeScript Express API for managing users and bank accounts. This project provides a simple backend for creating customers, opening accounts, updating account information, processing deposits and withdrawals, and tracking transaction history.

The service stores users, accounts, and transactions in MongoDB Atlas and includes Swagger documentation for exploring the available endpoints.

## Overview

This backend supports the core banking workflow:

- Create, read, update, and delete users
- Create, read, update, and delete accounts
- Deposit money into an account
- Withdraw money from an account
- View account transaction history
- Explore the API through Swagger UI

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB Atlas with Mongoose
- Swagger UI
- Swagger JSDoc

## Project Structure

```text
bankapp-node-api-backend/
  package.json
  server.ts
  src/
    app.ts
    swagger.ts
    controllers/
    models/
    repositories/
    routes/
    services/
    utilities/
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed

> On Windows PowerShell, if `npm` is blocked by execution policy, use `npm.cmd` instead.

## Setup

1. Open a terminal in the project folder:

   ```bash
   cd bankapp-node-api-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   Or in PowerShell:

   ```powershell
   npm.cmd install
   ```

## Run the Project

### Configure MongoDB Atlas

1. Create an Atlas database user and allow your development IP address under **Network Access**.
2. Copy the connection string from Atlas and replace the placeholders in `bankapp-node-api-backend/.env.example` with your cluster, database, username, and password.
3. Save the configured file as `bankapp-node-api-backend/.env`. The `.env` file is ignored by Git.

If the password contains reserved URI characters, percent-encode them in the connection string. The server connects to MongoDB before listening for requests. Atlas supports the transactions used to keep balance changes and transaction records consistent.

### Development mode

```bash
npm run dev
```

Or:

```powershell
npm.cmd run dev
```

This runs the server with `tsx watch`, so it restarts automatically when files change.

### Production build

```bash
npm run build
```

Then start the compiled app:

```bash
npm start
```

## Local URLs

After starting the server:

- API: <http://localhost:5000>
- Swagger docs: <http://localhost:5000/api-docs>

## Example Endpoints

- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

- `POST /api/accounts`
- `GET /api/accounts/:id`
- `PUT /api/accounts/:id`
- `DELETE /api/accounts/:id`
- `POST /api/accounts/:id/deposit`
- `POST /api/accounts/:id/withdraw`
- `GET /api/accounts/:id/transactions`
