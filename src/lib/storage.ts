import { mkdir, appendFile, readFile, access } from "fs/promises";
import path from "path";

const DATA_ROOT = path.join(process.cwd(), "data");

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

export async function appendJsonl(
  relativeFile: string,
  record: Record<string, unknown>,
) {
  const filePath = path.join(DATA_ROOT, relativeFile);
  await ensureDir(path.dirname(filePath));
  await appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");
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
}
