export interface BlogPost {
  title: string;
  content: string;
  slug: string;
  date: string;
  excerpt?: string;
  featuredImage?: string;
}

export function cleanTitle(title: string): string {
  return title.replace(' – Test site', '').trim();
}

export function getValidPosts(posts: BlogPost[]): BlogPost[] {
  // Filter out invalid posts and duplicates
  const validPosts = posts.filter(post => 
    post.slug && 
    post.slug !== 'index' &&
    post.slug !== 'index.php' &&
    !post.title.includes('Page not found') &&
    post.content.length > 0
  );

  // Remove duplicates based on slug
  const uniquePosts = validPosts.reduce((acc: BlogPost[], current) => {
    const exists = acc.find(post => post.slug === current.slug);
    if (!exists) {
      acc.push({
        ...current,
        title: cleanTitle(current.title)
      });
    }
    return acc;
  }, []);

  // Sort by date, newest first
  return uniquePosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}