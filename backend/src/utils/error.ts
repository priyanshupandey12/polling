import type { ApiError as IApiError } from "../types/error.type.js";

class ApiError extends Error {
  statusCode: number;

  constructor(error: IApiError) {
    super(error.message);
    this.statusCode = error.statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    return new ApiError({ statusCode: 400, message });
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError({ statusCode: 401, message });
  }
  static conflict(message = "Conflict") {
    return new ApiError({ statusCode: 409, message });
  }
  static forbidden(message = "forbidden") {
    return new ApiError({ statusCode: 412, message });
  }
  static notfound(message = "notfound") {
    return new ApiError({ statusCode: 404, message });
  }
}

export default ApiError;