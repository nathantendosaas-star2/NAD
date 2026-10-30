# Nairobi Apparel District (NAD)

## Deploy to Render

This repository includes a Render Blueprint in `render.yaml`.

1. Sign in to [Render](https://dashboard.render.com/).
2. Choose **New → Blueprint** and connect this GitHub repository.
3. Merge [PR #1](https://github.com/nathantendosaas-star2/NAD/pull/1) into `main`, then select the `main` branch and apply the Blueprint.
4. In the new web service's Environment settings, set strong, unique values for:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
5. Wait for the deploy to finish and verify the service's `/health` endpoint returns `{"status":"ok"}`.

The Blueprint currently uses Render's **Free** instance for a no-cost preview. Free services can sleep after inactivity and are not recommended for production commerce. Upgrade to a paid instance before launch.

## Runtime

- Build: `npm install && npm run build`
- Start: `npm start`
- Health check: `/health`
- Node.js: 22.12 or newer

The Express server serves the compiled Vite frontend from `dist/` in production. The development server continues to use Vite middleware.

## Important before accepting real customers

- Admin routes use HTTP Basic Authentication in production. Set both admin environment variables in Render before sharing the service. Do not put credentials in source control.
- Cart, inventory, and analytics data are currently held in process memory. They are temporary and can reset on restarts, redeploys, or instance replacement. Move these stores to a managed database (for example, Render Postgres) before relying on them for orders or stock management.
- The checkout flow should be integrated with a real payment provider and verified server-side before taking payments.
- Review privacy and retention for visitor IP addresses and user-agent telemetry before launch.
- Keep all API keys and secrets in Render environment variables, never in frontend code or committed files.
