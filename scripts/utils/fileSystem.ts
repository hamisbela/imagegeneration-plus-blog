import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';

export const ensureDirectoryExists = async (filePath: string): Promise<void> => {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
};

export const writeJsonToFile = async (filePath: string, data: unknown): Promise<void> => {
  await ensureDirectoryExists(filePath);
  const jsonData = JSON.stringify(data, null, 2);
  await writeFile(filePath, jsonData, 'utf-8');
};