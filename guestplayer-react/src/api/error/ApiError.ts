import { ErrorCode } from "./ErrorCodes";

export class ApiError extends Error {

  public statusCode: number;
  public body?: any;
  public errorCode?: ErrorCode;

  constructor(statusCode: number, body?: any) {
    super();
    this.statusCode = statusCode;
    this.body = body;

    if (body && body.errorCode) {
      this.errorCode = body.errorCode;
    }
  }

  

}