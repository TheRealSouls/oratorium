import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const workspace = process.cwd();
const nextDir = path.resolve(workspace, ".next");

if (existsSync(nextDir)) {
  if (!nextDir.startsWith(workspace)) {
    throw new Error(`Refusing to remove a directory outside the workspace: ${nextDir}`);
  }

  rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next cache; Next will rebuild it.");
}
