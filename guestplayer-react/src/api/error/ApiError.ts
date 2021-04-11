export class ApiError extends Error {

  public statusCode: number;
  public body?: any;

  constructor(statusCode: number, body?: any) {
    super();
    this.statusCode = statusCode;
    this.body = body;
  }

  

}