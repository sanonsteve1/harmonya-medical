import { mkdir, appendFile, readFile, access } from "fs/promises";
import path from "path";

/** Local/dev: ./data — Vercel without Redis: /tmp (ephemeral) */
const DATA_ROOT = process.env.VERCEL
  ? path.join("/tmp", "harmonya-data")
  : path.join(process.cwd(), "data");

function redisConfig() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    "";
  if (!url || !token) return null;
  return { url, token };
}

/** True when leads/analytics survive cold starts (Redis configured). */
export function isPersistentStorage() {
  return Boolean(redisConfig()) || !process.env.VERCEL;
}

function redisKey(relativeFile: string) {
  return `hm:${relativeFile.replaceAll("\\", "/")}`;
}

async function redisCommand<T = unknown>(
  ...args: (string | number)[]
): Promise<T | null> {
  const config = redisConfig();
  if (!config) return null;

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`redis_${response.status}:${text.slice(0, 200)}`);
  }

  const json = (await response.json()) as { result?: T };
  return json.result ?? null;
}

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

export async function appendJsonl(
  relativeFile: string,
  record: Record<string, unknown>,
): Promise<boolean> {
  const line = JSON.stringify(record);

  try {
    if (redisConfig()) {
      await redisCommand("RPUSH", redisKey(relativeFile), line);
      return true;
    }

    const filePath = path.join(DATA_ROOT, relativeFile);
    await ensureDir(path.dirname(filePath));
    await appendFile(filePath, `${line}\n`, "utf8");
    return true;
  } catch (error) {
    console.error("[storage] appendJsonl_failed", relativeFile, error);
    return false;
  }
}

export async function readJsonl<T extends Record<string, unknown>>(
  relativeFile: string,
): Promise<T[]> {
  try {
    if (redisConfig()) {
      const rows = await redisCommand<string[]>(
        "LRANGE",
        redisKey(relativeFile),
        0,
        -1,
      );
      if (!rows?.length) return [];
      return rows
        .map((line) => {
          try {
            return JSON.parse(line) as T;
          } catch {
            return null;
          }
        })
        .filter((item): item is T => item !== null);
    }

    const filePath = path.join(DATA_ROOT, relativeFile);

    try {
      await access(filePath);
    } catch {
      return [];
    }

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
