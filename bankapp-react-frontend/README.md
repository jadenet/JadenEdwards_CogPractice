# ABC Bank

ABC Bank is a responsive React Router frontend for the Node REST API in `../bankapp-node-api-backend`. It uses Tailwind CSS 4 and shadcn/ui components.

## Run locally

1. Configure `MONGODB_URI` in `../bankapp-node-api-backend/.env`.
2. Start the API from `bankapp-node-api-backend` with `npm run dev`. It listens on port 5000 by default.
3. Start this frontend with `npm run dev`. Vite serves it at `http://localhost:5173` and proxies `/api` requests to the backend.

On Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm`.

Set `VITE_API_BASE_URL` to a different API base path or URL when deploying outside the local Vite proxy. A cross-origin API must allow requests from the frontend origin.

## Banking workflows

The interface supports user creation, lookup, editing, listing, and deletion; account creation, lookup, editing, and deletion; deposits and withdrawals; and account transaction history. Account IDs are entered directly or saved in the current browser because the API does not provide an account-list endpoint.

Build the production app with `npm run build` and check types with `npm run typecheck`.
