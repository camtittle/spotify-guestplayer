import { ApiError } from "../error/ApiError";
import { StatusCode } from "../models/statusCodes";

export interface PathParams {
  [key: string]: string
};

export interface Headers {
  [key: string]: string
};

export const getBearerTokenHeaders = (bearerToken: string) => {
  return {
    Authorization: `Bearer ${bearerToken}`
  };
}


const getEndpointUrl = (path: string, pathParams?: PathParams) => {
  let url = process.env.REACT_APP_API_URL + path;
  if (pathParams) {
    Object.keys(pathParams).forEach(key => {
      url = url.replace(`{${key}}`, pathParams[key]);
    });
  }
  return url;
}

export const post = async <TResponse>(path: string, body: any, pathParams?: PathParams, headers?: Headers): Promise<TResponse> => {
  const url = getEndpointUrl(path, pathParams);

  const params: RequestInit = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    }
  }

  if (headers) {
    Object.keys(headers).forEach(key => {
      (params.headers as Record<string, string>)[key] = headers[key]
    })
  }

  const response = await fetch(url, params);

  if (response.status !== StatusCode.Ok) {
    throw new ApiError(response.status, await response.json())
  }

  return await response.json() as TResponse;
}

export const get = async <TResponse>(path: string, pathParams: PathParams, headers?: Headers): Promise<TResponse> => {
  const url = getEndpointUrl(path, pathParams);
  const params: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (headers) {
    Object.keys(headers).forEach(key => {
      (params.headers as Record<string, string>)[key] = headers[key]
    })
  }

  const response = await fetch(url, params);

  if (response.status !== StatusCode.Ok) {
    throw new ApiError(response.status, await response.json())
  }

  return await response.json() as TResponse;
};