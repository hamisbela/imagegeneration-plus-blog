import AdmZip from 'adm-zip';
import * as cheerio from 'cheerio';
import { existsSync } from 'node:fs';
import type { BlogPost } from '../../src/types/BlogPost.js';

export const extractPostFromHtml = (content: string): BlogPost | null => {
  const $ = cheerio.load(content);
  
  // Get the post title, being more specific with selectors and cleaning
  let title = '';
  
  // Try different title selectors in order of preference
  const possibleTitles = [
    $('h1.wp-block-post-title').first().text().trim(),
    $('h2.wp-block-post-title a').first().text().trim(),
    $('h1.entry-title').first().text().trim(),
    $('title').first().text().trim()
  ];

  // Use the first non-empty title found
  title = possibleTitles.find(t => t) || '';

  // Clean up the title
  title = title
    .replace(' – Test site', '')
    .replace(/Hello world!$/i, '')  // Remove "Hello world!" if it's at the end
    .trim();
  
  // Get the post content
  const postContent = $('.entry-content').html() || $('.wp-block-post-content').html() || '';
  
  // Extract the slug from the post URL or h2 link
  let slug = '';
  const postLink = $('h2.wp-block-post-title a').attr('href') || 
                  $('link[rel="canonical"]').attr('href') || 
                  $('meta[property="og:url"]').attr('content') || '';
  
  if (postLink) {
    const matches = postLink.match(/\/([^/]+?)\/?$/);
    if (matches && matches[1]) {
      slug = matches[1];
    }
  }
  
  // Skip if this is not a valid post
  if (!title || !postContent || !slug || 
      slug === 'index' || 
      slug === 'index.php' || 
      title.includes('Page not found')) {
    return null;
  }

  // Get the post date
  const dateElement = $('.wp-block-post-date time').attr('datetime') ||
                     $('meta[property="article:published_time"]').attr('content');
  const date = dateElement || new Date().toISOString();

  // Get the excerpt
  const excerpt = $('.entry-content p').first().text().trim() ||
                 $('.wp-block-post-content p').first().text().trim() ||
                 $('meta[name="description"]').attr('content') || '';

  // Get the featured image
  const featuredImage = $('.wp-block-post-content img').first().attr('src') ||
                       $('meta[property="og:image"]').attr('content') || '';

  return {
    title,
    content: postContent,
    slug,
    date,
    excerpt: excerpt.substring(0, 150) + (excerpt.length > 150 ? '...' : ''),
    featuredImage
  };
};

export const extractPostsFromZip = (zipPath: string): BlogPost[] => {
  if (!existsSync(zipPath)) {
    throw new Error('WordPress export file not found. Please place wordpress-export.zip in the project root.');
  }

  try {
    const zip = new AdmZip(zipPath);
    const entries = zip.getEntries();
    const posts: BlogPost[] = [];
    const processedSlugs = new Set<string>();

    for (const entry of entries) {
      if (entry.entryName.endsWith('.html') && !entry.entryName.includes('/wp-')) {
        const content = entry.getData().toString('utf8');
        try {
          const post = extractPostFromHtml(content);
          if (post && !processedSlugs.has(post.slug)) {
            posts.push(post);
            processedSlugs.add(post.slug);
          }
        } catch (error) {
          console.warn(`Warning: Could not process ${entry.entryName}:`, error);
        }
      }
    }

    // Sort posts by date, newest first
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    throw new Error(`Failed to process ZIP file: ${error instanceof Error ? error.message : String(error)}`);
  }
};