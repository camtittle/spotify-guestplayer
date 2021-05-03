import { environment } from "../../envionment";
import { ApiError } from "../error/ApiError";
import { StatusCode } from "../models/statusCodes";

export interface PathParams {
  [key: string]: string
};

const getEndpointUrl = (path: string, pathParams?: PathParams) => {
  let url = environment.apiBaseUrl + path;
  console.log(pathParams);
  if (pathParams) {
    Object.keys(pathParams).forEach(key => {
      console.log(key)
      url = url.replace(`{${key}}`, pathParams[key]);
    });
  }
  return url;
}

export const post = async <TResponse>(path: string, body: any): Promise<TResponse> => {
  const url = getEndpointUrl(path);

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

export const get = async <TResponse>(path: string, pathParams: PathParams): Promise<TResponse> => {
  const url = getEndpointUrl(path, pathParams);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== StatusCode.Ok) {
    throw new ApiError(response.status, await response.json())
  }

  return await response.json() as TResponse;
};