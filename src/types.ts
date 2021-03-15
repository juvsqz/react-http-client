export type HttpClientConfiguration = {
  /**
   * Handles and performs the http request.
   * You can apply different http libraries since
   * it only requires url and options.
   */
  requestHandler: RequestHandler;

  /**
   * Handle http response behavior such as handling 4xx & 5xx errors.
   */
  responseHandler: ResponseHandler;
};

// Response model for failed http requests
export type HttpErrorResponse = {
  /**
   * Unique code of the error.
   * It can be custom or using the default HTTP codes.
   */
  code: string | number;

  /**
   * Descriptive information about the error.
   */
  message: string;

  /**
   * List of additional information about the error
   */
  errors?: Array<Record<any, any>>;
};

// Response model for all http requests.
export type HttpClientResponse<D = any> = {
  /**
   * The HTTP request status.
   */
  status: number;

  /**
   * Http request data
   */
  data: D | null;

  /**
   * Http error response data when the request fails.
   * This should be null if the request succeeded
   */
  error: HttpErrorResponse | null;
};

// Request handler function typings
export type RequestHandler = <D = any>(
  url: string,
  options: any
) => Promise<HttpClientResponse<D>>;

// Response handler function typings
export type ResponseHandler<D = any> = (
  data: HttpClientResponse<D>
) => Promise<HttpClientResponse<D>>;

// This is the function typings for the caller function returned after invoking the
// http client hook.
export type HttpClientCallerOptions<O = Record<any, any>> = {
  /**
   * Overrides the default RequestHandler's options
   */
  options?: O;

  /**
   * Add a url path or override the main url for specific request.
   * Just provide a valid url when overriding the instance request url.
   */
  path?: string;

  /**
   * A flag to skip the context's response handler execution.
   */
  ignoreResponseHandler?: boolean;
} & Partial<HttpClientConfiguration>;
