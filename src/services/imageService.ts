import { togetherClient } from './togetherClient';
import { ImageGenerationError } from '../utils/errorHandling';

export interface GenerateImageOptions {
  width?: number;
  height?: number;
  steps?: number;
}

export async function generateInteriorDesign(
  prompt: string,
  options: GenerateImageOptions = {}
): Promise<string> {
  const { width = 1024, height = 1024, steps = 4 } = options;

  try {
    const response = await togetherClient.generateImage({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: `photorealistic interior design visualization, luxurious room design, high-quality 3D rendering, professional interior photography style: ${prompt}, interior view, beautiful lighting, high resolution, architectural photography, interior design magazine quality`,
      width,
      height,
      steps,
      n: 1,
      response_format: "b64_json"
    });

    return response.data[0].b64_json;
  } catch (error) {
    console.error('Error generating interior design:', error);
    throw error instanceof ImageGenerationError ? error : new ImageGenerationError('Failed to generate image');
  }
}