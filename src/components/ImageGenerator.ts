export function createImageGenerator(container: HTMLElement) {
  const template = `
    <div class="image-generator">
      <div class="input-group">
        <input
          type="text"
          class="prompt-input"
          placeholder="Describe your interior design"
        />
        <button class="generate-btn">Generate Design</button>
      </div>
      <div class="error-message" style="display: none;"></div>
      <div class="result-container" style="display: none;">
        <img class="generated-image" alt="Generated interior design" />
        <button class="download-btn">Download Image</button>
      </div>
    </div>
  `;

  container.innerHTML = template;

  const promptInput = container.querySelector('.prompt-input') as HTMLInputElement;
  const generateBtn = container.querySelector('.generate-btn') as HTMLButtonElement;
  const errorMessage = container.querySelector('.error-message') as HTMLDivElement;
  const resultContainer = container.querySelector('.result-container') as HTMLDivElement;
  const generatedImage = container.querySelector('.generated-image') as HTMLImageElement;
  const downloadBtn = container.querySelector('.download-btn') as HTMLButtonElement;

  return {
    promptInput,
    generateBtn,
    errorMessage,
    resultContainer,
    generatedImage,
    downloadBtn
  };
}