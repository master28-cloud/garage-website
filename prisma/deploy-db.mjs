/**
 * Runs inside Vercel's build (see "vercel-build" in package.json).
 *
 * The schema push and seed happen here rather than from a developer machine
 * because the office network blocks Postgres traffic: TCP 5432 connects, then
 * the firewall closes the connection mid-handshake. Vercel's build servers
 * reach Neon fine, and this way schema changes ship with each deploy.
 *
 * Only production builds touch the database. Previews are connected to the
 * same Neon database and must not rewrite its schema from a feature branch.
 *
 * `db push` refuses destructive changes without --accept-data-loss, so a
 * deploy that would drop data fails the build instead of dropping it.
 */
import { execSync } from "node:child_process";

const env = process.env.VERCEL_ENV;

if (env !== "production") {
  console.log(`[deploy-db] VERCEL_ENV=${env ?? "unset"}: skipping schema push and seed.`);
  process.exit(0);
}

console.log("[deploy-db] production build: syncing schema and seeding.");
execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
execSync("node prisma/seed-production.mjs", { stdio: "inherit" });
