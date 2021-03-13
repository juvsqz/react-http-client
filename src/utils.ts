/**
 * Test the url validity.
 * @see https://stackoverflow.com/questions/1701898/how-to-detect-whether-a-string-is-in-url-format-using-javascript
 *
 * @param url current url to test the validity.
 * @returns {boolean} whether the url is valid or not
 */
export const isValidUrl = (url = ''): boolean => {
  const regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(url);
};
