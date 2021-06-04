import axios, { AxiosResponse } from "axios";
import { ApiError } from "../error/ApiError";
import { StatusCode } from "../models/statusCodes";

export interface PathParams {
  [key: string]: string
};

export interface Headers {
  [key: string]: string
};

export  const getBearerTokenHeaders = (bearerToken: string) => {
  return {
    Authorization: `Bearer ${bearerToken}`
  };
}

const isSuccess = (response: AxiosResponse<any>): boolean => {
  return response.status === StatusCode.Ok || response.status === StatusCode.NoContent
}


const getEndpointUrl = (path: string, pathParams?: PathParams) => {
  let url = process.env.REACT_APP_API_URL + '/api' + path;
  if (pathParams) {
    Object.keys(pathParams).forEach(key => {
      url = url.replace(`{${key}}`, pathParams[key]);
    });
  }
  return url;
}

export const post = async <TResponse>(path: string, body: any, pathParams?: PathParams, headers?: Headers): Promise<TResponse> => {
  const url = getEndpointUrl(path, pathParams);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (headers) {
    Object.keys(headers).forEach(key => {
      (params.headers as Record<string, string>)[key] = headers[key]
    })
  }
  
  const response = await axios.post(url, body, params);

  if (!isSuccess(response)) {
    throw new ApiError(response.status, response.data)
  }
  
  return response.data;
}

export const get = async <TResponse>(path: string, pathParams?: PathParams, headers?: Headers): Promise<TResponse> => {
  const url = getEndpointUrl(path, pathParams);
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (headers) {
    Object.keys(headers).forEach(key => {
      (params.headers as Record<string, string>)[key] = headers[key]
    })
  }

  const response = await axios.get<TResponse>(url, params);

  if (!isSuccess(response)) {
    throw new ApiError(response.status, response.data)
  }

  return response.data;
};

export const del = async <TResponse>(path: string, pathParams?: PathParams, headers?: Headers): Promise<TResponse | undefined> => {
  const url = getEndpointUrl(path, pathParams);
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (headers) {
    Object.keys(headers).forEach(key => {
      (params.headers as Record<string, string>)[key] = headers[key]
    })
  }

  const response = await axios.delete(url, params);

  if (!isSuccess(response)) {
    throw new ApiError(response.status, response.data)
  }
  
  return response.data;
};