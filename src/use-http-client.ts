import { useContext } from 'react';

import HttpClientContextConfig from './context-config';
import { HttpClientResponse, HttpClientCallerOptions } from './types';

/**
 * This hook performs the http request from the requestHandler option and
 * handles the response and have the ability to control the behavior
 * based on the http client response.
 *
 * @example
 *  Handling 401 errors to redirect to the login page.
 * @example
 *  Send data to analytics provided when receiving error 5xx from the repsonse.
 *
 * @param {string} _url can be http request url, prefix or base path.
 * @returns {(options: HttpClientCallerOptions)=> Promise<HttpClientResponse>} is the http client caller function.
 */
function useHttpClient<O = RequestInit>(
  _url: string | null = null
): <D = any>(
  options: HttpClientCallerOptions<O>
) => Promise<HttpClientResponse<D>> {
  const {
    requestHandler: ctxReqHandler,
    responseHandler: ctxResHandler
  } = useContext(HttpClientContextConfig);

  /**
   * A caller function returned after instantiation of the hook.
   * It executes the request handler and validate and control the response behavior
   * based on the result of the http request.
   * @param _options overrides the context config options.
   * @returns {Promise<HttpClientResponse>} contains the stuctured http client response
   */
  async function caller<D = any>({
    path,
    options,
    requestHandler = ctxReqHandler,
    responseHandler = ctxResHandler,
    ignoreResponseHandler = false
  }: HttpClientCallerOptions<O>): Promise<HttpClientResponse> {
    const url = (path ? `${_url || ''}${path}` : _url)?.trim();

    if (!url) throw new Error(`URL should not be empty!`);

    const response = await requestHandler<D>(url, options || {});

    // Immediately return the response
    // and skip the responseHandler execution.
    if (ignoreResponseHandler) {
      return response;
    }

    return responseHandler(response);
  }

  return caller;
}

export default useHttpClient;
