import { createContext } from 'react';
import { HttpClientConfiguration } from './types';
import { defaultConfig } from './config';

export const HttpClientContextConfig = createContext<HttpClientConfiguration>(
  defaultConfig
);

HttpClientContextConfig.displayName = 'HttpClientContextConfig';
export default HttpClientContextConfig;
