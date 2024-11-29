import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { createBlogList } from './components/BlogList'
import { getValidPosts } from './types/BlogPost'
import { initRouter } from './router'
import { createImageGenerator } from './components/ImageGenerator'
import { generateInteriorDesign } from './services/imageService'
import blogPosts from './data/blog/posts.json'

const validPosts = getValidPosts(blogPosts);

// Initialize router
initRouter(validPosts);

// Render function for home page
function renderHomePage() {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
      <h1>Interior Design AI Generator</h1>
      <div id="imageGenerator"></div>
      ${createBlogList(validPosts)}
      <p class="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
      </p>
    </div>
  `;

  // Setup image generator
  const imageGeneratorContainer = document.querySelector('#imageGenerator')!;
  const {
    promptInput,
    generateBtn,
    errorMessage,
    resultContainer,
    generatedImage,
    downloadBtn
  } = createImageGenerator(imageGeneratorContainer);

  let isGenerating = false;

  generateBtn.addEventListener('click', async () => {
    if (isGenerating || !promptInput.value.trim()) return;

    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    errorMessage.style.display = 'none';
    
    try {
      const imageBase64 = await generateInteriorDesign(promptInput.value);
      generatedImage.src = `data:image/png;base64,${imageBase64}`;
      resultContainer.style.display = 'block';
      
      downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.href = generatedImage.src;
        link.download = 'interior-design.png';
        link.click();
      };
    } catch (error) {
      errorMessage.textContent = error instanceof Error ? error.message : 'Failed to generate image';
      errorMessage.style.display = 'block';
    } finally {
      isGenerating = false;
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Design';
    }
  });
}

// Initial render
renderHomePage();

// Listen for home page render events
window.addEventListener('render-home', renderHomePage);