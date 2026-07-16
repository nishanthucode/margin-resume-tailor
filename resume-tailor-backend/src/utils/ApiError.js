export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function badRequest(message, details) {
  return new ApiError(400, message, details);
}

export function notFound(message = "Not found") {
  return new ApiError(404, message);
}

export function serverError(message = "Something went wrong") {
  return new ApiError(500, message);
}
