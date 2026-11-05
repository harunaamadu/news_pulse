import { execSync } from "node:child_process";

const run = (command) => execSync(command, { stdio: "inherit" });

// Only production builds touch the production database
if (process.env.VERCEL_ENV === "production") {
  run("npx prisma migrate deploy");
} else {
  console.log(
    `Skipping migrations (VERCEL_ENV=${process.env.VERCEL_ENV ?? "local"}).`,
  );
}

run("npx next build");