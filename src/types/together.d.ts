declare module 'together-ai' {
  interface TogetherOptions {
    apiKey: string;
  }

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

  class Together {
    constructor(options: TogetherOptions);
    images: {
      create(params: ImageGenerationParams): Promise<ImageResponse>;
    };
  }

  export default Together;
}