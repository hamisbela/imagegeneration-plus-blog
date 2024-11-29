import { ImageGenerationError } from '../utils/errorHandling';

interface ImageGenerationParams {
  model: string;
  prompt: string;
  width: number;
  height: number;
  steps: number;
  n: number;
  response_format: string;
}

interface ImageResponse {
  data: Array<{ b64_json: string; }>;
}

class TogetherClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.together.xyz/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(params: ImageGenerationParams): Promise<ImageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ImageGenerationError(
          error.error || 'Failed to generate image',
          response.status.toString(),
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ImageGenerationError) {
        throw error;
      }
      throw new ImageGenerationError(
        error instanceof Error ? error.message : 'Failed to generate image'
      );
    }
  }
}

export const togetherClient = new TogetherClient(import.meta.env.VITE_TOGETHER_API_KEY);