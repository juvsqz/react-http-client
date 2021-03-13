import React from 'react';
import { render } from '@testing-library/react';
import HttpClientContextConfig from 'src/context-config';
import { HttpClientConfiguration } from 'src';
import { DEFAULT_HTTP_CLIENT_RESPONSE } from 'src/config';

describe('HttpClientContextConfig', () => {
  it('should provide the correct display name', () => {
    expect(HttpClientContextConfig.displayName).toEqual(
      'HttpClientContextConfig'
    );
  });

  test('HttpClientContextConfig consumer provides default value', async () => {
    const contextCallback = jest.fn();
    render(
      <HttpClientContextConfig.Consumer>
        {contextCallback}
      </HttpClientContextConfig.Consumer>
    );

    const contextValue = contextCallback.mock
      .calls[0][0] as HttpClientConfiguration;

    expect(
      await contextValue.requestHandler('http://www.xyz.com', null)
    ).toEqual(DEFAULT_HTTP_CLIENT_RESPONSE);

    // Assert response handler's return value as default value
    // regardless of the request data/
    expect(
      await contextValue.responseHandler({
        data: {},
        error: null,
        status: 100
      })
    ).toEqual(DEFAULT_HTTP_CLIENT_RESPONSE);
  });

  test('HttpClientContextConfig consumer provides value from provider', async () => {
    const contextCallback = jest.fn();
    const contextProviderValue: HttpClientConfiguration = {
      responseHandler: jest.fn(),
      requestHandler: jest.fn()
    };
    render(
      <HttpClientContextConfig.Provider value={contextProviderValue}>
        <HttpClientContextConfig.Consumer>
          {contextCallback}
        </HttpClientContextConfig.Consumer>
      </HttpClientContextConfig.Provider>
    );

    const contextValue = contextCallback.mock
      .calls[0][0] as HttpClientConfiguration;

    expect(contextValue).toEqual(contextProviderValue);
  });
});
