export function successResponse<T>(data: T) {
  return {
    success: true as const,
    data
  };
}

export function errorResponse(code: string, message: string, details?: unknown) {
  const error: { code: string; message: string; details?: unknown } = {
    code,
    message
  };

  if (details !== undefined) {
    error.details = details;
  }

  return {
    success: false as const,
    error
  };
}
