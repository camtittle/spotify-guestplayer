import { ApiError } from "./error/ApiError";
import { StatusCode } from "./models/statusCodes";

export const post = async <TRequest, TResponse> (url: string, body: TRequest): Promise<TResponse> => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== StatusCode.Ok) {
    throw new ApiError(response.status, await response.json())
  }

  return await response.json() as TResponse;
}