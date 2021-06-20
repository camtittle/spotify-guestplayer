import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getBearerToken } from '../auth/tokenManager';
import { ApiError } from "../error/ApiError";

export interface PathParams {
  [key: string]: string
};

export interface Headers {
  [key: string]: string
};

const getEndpointUrl = (path: string, pathParams?: PathParams) => {
  let url = process.env.REACT_APP_API_URL + '/api' + path;
  if (pathParams) {
    Object.keys(pathParams).forEach(key => {
      url = url.replace(`{${key}}`, pathParams[key]);
    });
  }
  return url;
}

export const post = async <TResponse>(path: string, body?: any, pathParams?: PathParams, headers?: Headers, skipAuth = false): Promise<TResponse> => {
  const url = getEndpointUrl(path, pathParams);

  const params: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  };

  if (headers) {
    Object.keys(headers).forEach(key => {
      (params.headers as Record<string, string>)[key] = headers[key]
    })
  }

  if (!skipAuth) {
    const bearerToken = await getBearerToken();
    if (bearerToken) {
      params.headers.Authorization = `Bearer ${bearerToken}`
    }
  }
  
  try {
    const response = await axios.post(url, body, params);
    return response.data;
  } catch (e) {
    if (e && e.response) {
      throw new ApiError(e.response.status, e.response.data);
    }
    throw e;
  }
}

export const get = async <TResponse>(path: string, pathParams?: PathParams, headers?: Headers, skipAuth = false): Promise<TResponse> => {
  const url = getEndpointUrl(path, pathParams);
  const params: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (headers) {
    Object.keys(headers).forEach(key => {
      (params.headers as Record<string, string>)[key] = headers[key]
    })
  }

  if (!skipAuth) {
    const bearerToken = await getBearerToken();
    if (bearerToken) {
      params.headers.Authorization = `Bearer ${bearerToken}`
    }
  }

  try {
    const response = await axios.get<TResponse>(url, params);
    return response.data;
  } catch (e) {
    if (e && e.response) {
      throw new ApiError(e.response.status, e.response.data);
    }
    throw e;
  }
};

export const del = async <TResponse>(path: string, pathParams?: PathParams, headers?: Headers): Promise<TResponse | undefined> => {
  const url = getEndpointUrl(path, pathParams);
  const params: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (headers) {
    Object.keys(headers).forEach(key => {
      (params.headers as Record<string, string>)[key] = headers[key]
    })
  }

  const bearerToken = await getBearerToken();
  if (bearerToken) {
    params.headers.Authorization = `Bearer ${bearerToken}`
  }

  try {
    const response = await axios.delete(url, params);
    return response.data;
  } catch (e) {
    if (e && e.response) {
      throw new ApiError(e.response.status, e.response.data);
    }
    throw e;
  }

};