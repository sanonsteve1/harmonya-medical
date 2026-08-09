import { mkdir, appendFile, readFile, access } from "fs/promises";
import path from "path";

/** Local/dev: ./data — Vercel: /tmp (ephemeral, best-effort only) */
const DATA_ROOT = process.env.VERCEL
  ? path.join("/tmp", "harmonya-data")
  : path.join(process.cwd(), "data");

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

export async function appendJsonl(
  relativeFile: string,
  record: Record<string, unknown>,
): Promise<boolean> {
  try {
    const filePath = path.join(DATA_ROOT, relativeFile);
    await ensureDir(path.dirname(filePath));
    await appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");
    return true;
  } catch (error) {
    // Read-only FS / serverless limits — callers treat analytics as best-effort
    console.error("[storage] appendJsonl_failed", relativeFile, error);
    return false;
  }
}

export async function readJsonl<T extends Record<string, unknown>>(
  relativeFile: string,
): Promise<T[]> {
  const filePath = path.join(DATA_ROOT, relativeFile);

  try {
    await access(filePath);
  } catch {
    return [];
  }

  try {
    const raw = await readFile(filePath, "utf8");
    if (!raw.trim()) return [];

    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as T;
        } catch {
          return null;
        }
      })
      .filter((item): item is T => item !== null);
  } catch (error) {
    console.error("[storage] readJsonl_failed", relativeFile, error);
    return [];
  }
}
