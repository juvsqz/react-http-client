import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { render, waitFor } from '@testing-library/react';

import { useHttpClient } from 'src';
import { DEFAULT_HTTP_CLIENT_RESPONSE, defaultConfig } from 'src/config';
import HttpClientContextConfig from 'src/context-config';
import { HttpClientCallerOptions, HttpClientConfiguration } from 'src/types';

const TEST_URL = 'https://api.xyz.com';

// Mock the hook's default config
// to spy on the call
jest.mock('src/config', () => ({
  defaultConfig: {
    requestHandler: jest.fn().mockName('requestHandler'),
    responseHandler: jest.fn().mockName('responseHandler')
  }
}));

describe('useHttpClient hook', () => {
  /**
   * Test component
   */
  type TestPageProps = {
    url?: string;
  } & HttpClientCallerOptions<any>;
  const Page = ({ url, ...otherProps }: TestPageProps): JSX.Element => {
    const httpClient = useHttpClient(url);

    // Force to trigger the http client hook
    React.useEffect(() => {
      httpClient({ ...otherProps });
    }, []);
    return <div></div>;
  };

  const contextProviderValue: HttpClientConfiguration = {
    requestHandler: jest
      .fn()
      .mockName('requestHandler')
      .mockResolvedValue(DEFAULT_HTTP_CLIENT_RESPONSE),
    responseHandler: jest.fn().mockName('responseHandler')
  };

  it('should return the caller function after invoking the hook', () => {
    const { result } = renderHook(() => useHttpClient());
    expect(typeof result.current).toBe('function');
  });

  it('should use the default configuration when no context provider', async () => {
    const { result } = renderHook(() => useHttpClient(TEST_URL));
    let response;
    await act(async () => {
      response = await result.current({});
    });
    expect(response).toEqual(DEFAULT_HTTP_CLIENT_RESPONSE);
  });
  it('should use the provider configuration', async () => {
    render(
      <HttpClientContextConfig.Provider value={contextProviderValue}>
        <Page url={TEST_URL} />
      </HttpClientContextConfig.Provider>
    );

    await waitFor(() =>
      expect(contextProviderValue.requestHandler).toBeCalled()
    );
    await waitFor(() =>
      expect(contextProviderValue.responseHandler).toBeCalled()
    );
  });

  it('should not execute the responseHandler function when the ignoreResponseHandler flag is set to true', async () => {
    render(
      <HttpClientContextConfig.Provider value={contextProviderValue}>
        <Page ignoreResponseHandler={true} url={TEST_URL} />
      </HttpClientContextConfig.Provider>
    );

    await waitFor(() =>
      expect(contextProviderValue.responseHandler).not.toBeCalled()
    );
  });

  it('should use the url from the hook invocation', async () => {
    render(
      <HttpClientContextConfig.Provider value={contextProviderValue}>
        <Page url={TEST_URL} />
      </HttpClientContextConfig.Provider>
    );

    await waitFor(() =>
      expect(contextProviderValue.requestHandler).toBeCalledWith(
        TEST_URL,
        expect.anything()
      )
    );
  });

  it('should use the url from the hook invocation and combine it to the url path provided from caller function', async () => {
    const testPath = '/test-path';
    render(
      <HttpClientContextConfig.Provider value={contextProviderValue}>
        <Page url={TEST_URL} path={testPath} />
      </HttpClientContextConfig.Provider>
    );

    await waitFor(() =>
      expect(contextProviderValue.requestHandler).toBeCalledWith(
        `${TEST_URL}${testPath}`,
        expect.anything()
      )
    );
  });
  it('should use the url path from the caller function as the main request url', async () => {
    const path = `${TEST_URL}/test-path`;
    render(
      <HttpClientContextConfig.Provider value={contextProviderValue}>
        <Page path={path} />
      </HttpClientContextConfig.Provider>
    );

    await waitFor(() =>
      expect(contextProviderValue.requestHandler).toBeCalledWith(
        path,
        expect.anything()
      )
    );
  });

  it('should throw an error when url is not provided', () => {
    const { result } = renderHook(() => useHttpClient());
    expect(result.current({})).rejects.toThrowError('URL should not be empty!');
  });

  it('should be able to execute multiple http requests from different url paths using the same hook invocation', async () => {
    const { result } = renderHook(() => useHttpClient(TEST_URL));
    const paths = ['/first-path', '/second-path'];

    // First http request
    await result.current({ path: paths[0] });
    expect(defaultConfig.requestHandler).toBeCalledWith(
      `${TEST_URL}${paths[0]}`,
      expect.anything()
    );

    // Second http request
    await result.current({ path: paths[1] });
    expect(defaultConfig.requestHandler).toBeCalledWith(
      `${TEST_URL}${paths[1]}`,
      expect.anything()
    );
  });

  it('should override the default requestHandler when providing custom one in the caller function', async () => {
    const { result } = renderHook(() => useHttpClient(TEST_URL));
    const customRequestHandler = jest.fn();
    await result.current({
      requestHandler: customRequestHandler
    });
    expect(customRequestHandler).toBeCalledWith(
      `${TEST_URL}`,
      expect.anything()
    );
  });
  it('should override the default responseHandler when providing custom one in the caller function', async () => {
    const { result } = renderHook(() => useHttpClient(TEST_URL));
    const customResponseHandler = jest.fn();
    await result.current({
      responseHandler: customResponseHandler
    });
    expect(customResponseHandler).toBeCalled();
  });

  it('should not override the default requestHandler after overriding it in the previous request', async () => {
    const { result } = renderHook(() => useHttpClient(TEST_URL));
    const customRequestHandler = jest.fn();
    await result.current({
      requestHandler: customRequestHandler
    });
    expect(customRequestHandler).toBeCalled();
    customRequestHandler.mockReset();

    await result.current({});
    expect(customRequestHandler).not.toBeCalled();
    expect(defaultConfig.requestHandler).toBeCalled();
  });

  it('should not override the default responseHandler after overriding it in the previous request', async () => {
    const { result } = renderHook(() => useHttpClient(TEST_URL));
    const customResponseHandler = jest.fn();
    await result.current({
      responseHandler: customResponseHandler
    });
    expect(customResponseHandler).toBeCalled();
    customResponseHandler.mockReset();

    await result.current({});
    expect(customResponseHandler).not.toBeCalled();
    expect(defaultConfig.responseHandler).toBeCalled();
  });
});
