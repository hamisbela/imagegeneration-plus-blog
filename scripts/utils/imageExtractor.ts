import AdmZip from 'adm-zip';
import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

export async function extractImages(zipPath: string): Promise<string[]> {
  if (!existsSync(zipPath)) {
    throw new Error('WordPress export file not found');
  }

  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();
  const extractedImages: string[] = [];

  // Create the wp-content/uploads directory structure
  const baseUploadPath = join('public', 'wp-content', 'uploads');
  await mkdir(baseUploadPath, { recursive: true });

  for (const entry of entries) {
    if (entry.entryName.startsWith('wp-content/uploads/') && 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(entry.entryName)) {
      try {
        const outputPath = join('public', entry.entryName);
        const outputDir = join(outputPath, '..');
        
        // Create directory if it doesn't exist
        await mkdir(outputDir, { recursive: true });
        
        // Extract the image
        await writeFile(outputPath, entry.getData());
        extractedImages.push(entry.entryName);
        
        console.log(`✓ Extracted: ${entry.entryName}`);
      } catch (error) {
        console.warn(`⚠️ Failed to extract ${entry.entryName}:`, error);
      }
    }
  }

  return extractedImages;
}