import React from 'react';

/**
 * @todo Complete the unit test
 */
describe.skip('useHttpClient hook', () => {
  it('should return the caller function after invoking the hook');

  it('should use the default configuration when no context provider');
  it('should use the provider configuration');

  it('should execute the requestHandler function upon request');
  it('should execute the responseHandler function when the request succeeded');
  it(
    'should not execute the responseHandler function when the ignoreResponseHandler flag is set to true'
  );

  it('should use the url from the hook invocation');
  it(
    'should use the url from the hook invocation and combine it to the url path provided from caller function'
  );
  it(
    'should use the url path from the caller function as the main request url'
  );
  it('should throw an error when providing an incorrect url');
  it('should throw an error when providing an incorrect url path');
  it(
    'should throw an error when providing an incorrect url and url path combination'
  );

  it('should throw an error when the requestHandler execution fails');
  it('should throw an error when the responseHandler execution fails');

  it(
    'should be able to execute different requests from different url paths using the same hook invocation'
  );

  it(
    'should beoverride the default requestHandler when providing custom requestHandler in the caller function'
  );
  it(
    'should override the default responseHandler when providing custom responseHandler  in the caller function'
  );

  it(
    'should not override the default responseHandler after overriding it in the previous request'
  );
});
