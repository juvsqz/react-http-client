import { isValidUrl } from 'src/utils';

describe('Utility function', () => {
  describe('isValidUrl function', () => {
    it('should return true when the url is valid', () => {
      const result = isValidUrl('http://www.google.com');
      expect(result).toBeTruthy();
    });

    it('should return false when the url is invalid', () => {
      const result = isValidUrl('httpxxxx://www.google.com');
      expect(result).toBeFalsy();
    });

    it('should return false when url is not provided', () => {
      const result = isValidUrl();
      expect(result).toBeFalsy();
    });
  });
});
