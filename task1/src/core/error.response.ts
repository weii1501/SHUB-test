"use strict";

const STATUS_CODE = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
};

const REASON_STATUS = {
  FORBIDDEN: "Bad Request Error",
  NOT_FOUND: "Not Found Error",
  CONFLICT: "Conflict Error",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  BAD_REQUEST: "Bad Request Error",
};

class ErrorResponse extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS.CONFLICT,
    statusCode = STATUS_CODE.CONFLICT
  ) {
    super(message, statusCode);
    this.name = "ConflictRequestError";
    Object.setPrototypeOf(this, ConflictRequestError.prototype);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS.BAD_REQUEST,
    statusCode = STATUS_CODE.BAD_REQUEST
  ) {
    super(message, statusCode);
    this.name = "BadRequestError";
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

class ServerError extends ErrorResponse {
  constructor(
    message = REASON_STATUS.INTERNAL_SERVER_ERROR,
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
    this.name = "ServerError";
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

class CustomError extends ErrorResponse {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = "CustomError";
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export { ErrorResponse, ConflictRequestError, BadRequestError, ServerError, CustomError };
