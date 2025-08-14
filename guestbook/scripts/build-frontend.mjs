import { spawnSync } from "node:child_process";

const raw = process.env.BASE_HREF || "/guestbook/";
const base = raw.endsWith("/") ? raw : raw + "/";

const args = [
  "build",
  "frontend/index.html",
  "--dist-dir",
  "dist/frontend",
  "--public-url",
  base,
];

const { status } = spawnSync("parcel", args, { stdio: "inherit", shell: true });
process.exit(status ?? 1);
