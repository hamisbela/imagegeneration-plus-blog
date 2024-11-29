export class ImageGenerationError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ImageGenerationError';
  }
}

export function handleImageGenerationError(error: unknown): ImageGenerationError {
  if (error instanceof ImageGenerationError) {
    return error;
  }

  if (error instanceof Error) {
    return new ImageGenerationError(error.message);
  }

  return new ImageGenerationError('An unknown error occurred during image generation');
}