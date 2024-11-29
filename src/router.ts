import type { BlogPost } from './types/BlogPost';

export function initRouter(posts: BlogPost[]) {
  // Handle navigation
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href?.startsWith('/posts/')) {
        e.preventDefault();
        const slug = href.replace('/posts/', '');
        const post = posts.find(p => p.slug === slug);
        if (post) {
          renderPost(post);
        }
      }
    }
  });

  // Handle back/forward navigation
  window.addEventListener('popstate', (e) => {
    if (e.state?.post) {
      renderPost(e.state.post);
    } else {
      renderHome(posts);
    }
  });
}

function renderPost(post: BlogPost) {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  history.pushState({ post }, '', `/posts/${post.slug}`);
  
  app.innerHTML = `
    <div class="post-detail">
      <a href="/" class="back-link">&larr; Back to Home</a>
      <h1>${post.title}</h1>
      <div class="post-meta">
        <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time>
      </div>
      <div class="post-content">
        ${post.content}
      </div>
    </div>
  `;
}

export function renderHome(posts: BlogPost[]) {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  history.pushState(null, '', '/');
  
  // Re-render the home page (this will be called from main.ts)
  const event = new CustomEvent('render-home');
  window.dispatchEvent(event);
}