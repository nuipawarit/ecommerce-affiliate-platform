export class MarketplaceError extends Error {
  constructor(
    message: string,
    public marketplace: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'MarketplaceError';

    if (originalError && originalError.stack) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}

export function createInvalidUrlError(marketplace: string, url: string): MarketplaceError {
  return new MarketplaceError(
    `Invalid ${marketplace} URL format: ${url}`,
    marketplace
  );
}

export function createProductNotFoundError(marketplace: string, productId: string): MarketplaceError {
  return new MarketplaceError(
    `Product not found on ${marketplace}: ${productId}`,
    marketplace
  );
}
