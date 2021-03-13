import { HttpClientConfiguration } from './types';

export const DEFAULT_HTTP_CLIENT_RESPONSE = {
  data: null,
  error: null,
  status: 500
};

export const defaultConfig: HttpClientConfiguration = {
  requestHandler: () => Promise.resolve(DEFAULT_HTTP_CLIENT_RESPONSE),
  responseHandler: () => Promise.resolve(DEFAULT_HTTP_CLIENT_RESPONSE)
};
