import type { BlogPost } from '../types/BlogPost';

export function createBlogList(posts: BlogPost[]): string {
  if (!posts.length) {
    return `
      <div class="blog-posts">
        <h2>Latest Blog Posts</h2>
        <p>No blog posts found.</p>
      </div>
    `;
  }

  return `
    <div class="blog-posts">
      <h2>Latest Blog Posts</h2>
      <ul class="post-list">
        ${posts.map(post => `
          <li class="post-item">
            <h3><a href="/posts/${post.slug}" class="post-link">${post.title}</a></h3>
            <div class="post-meta">
              <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time>
            </div>
            ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
            ${post.featuredImage ? `
              <img src="${post.featuredImage}" alt="${post.title}" class="post-featured-image">
            ` : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}