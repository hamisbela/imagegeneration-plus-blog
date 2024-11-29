import { join } from 'node:path';
import { extractPostsFromZip } from './utils/postExtractor.js';
import { extractImages } from './utils/imageExtractor.js';
import { writeJsonToFile } from './utils/fileSystem.js';

const EXPORT_PATH = './wordpress-export.zip';
const BLOG_DATA_DIR = './src/data/blog';

async function main() {
  try {
    console.log('🔄 Starting blog import process...');
    
    // Extract posts from zip file
    const posts = extractPostsFromZip(EXPORT_PATH);
    
    if (posts.length === 0) {
      console.warn('⚠️ No blog posts were found in the export file');
      process.exit(0);
    }

    // Extract images from zip file
    console.log('📸 Extracting images...');
    const extractedImages = await extractImages(EXPORT_PATH);
    console.log(`✅ Extracted ${extractedImages.length} images`);
    
    // Save posts to JSON file
    const outputPath = join(BLOG_DATA_DIR, 'posts.json');
    await writeJsonToFile(outputPath, posts);
    
    console.log(`✅ Successfully imported ${posts.length} blog posts`);
    console.log(`📁 Blog data saved to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error importing blog posts:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});