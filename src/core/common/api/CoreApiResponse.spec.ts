import { CoreApiResponse } from './CoreApiResponse';
import { Code } from '@core/common/code/Code';

describe('CoreApiReponse', () => {
  describe('Success', () => {
    test('When input args are empty, expect it creates a reponse with default parameters', () => {
      const currentDate: number = Date.now();

      const response: CoreApiResponse<unknown> = CoreApiResponse.success();

      expect(response.code).toBe(Code.SUCCESS.code);
      expect(response.message).toBe(Code.SUCCESS.message);
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate - 5000);
    });

    test('When input args are set, expect it creates a response with input args', () => {
      const currentDate: number = Date.now();
      const customMessage = 'Custom Success response';
      const customData: Record<string, unknown> = { result: customMessage };

      const response: CoreApiResponse<unknown> = CoreApiResponse.success(
        customData,
        customMessage,
      );

      expect(response.code).toBe(Code.SUCCESS.code);
      expect(response.message).toBe(customMessage);
      expect(response.data).toEqual(customData);
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate - 5000);
    });
  });

  describe('Error', () => {
    test('When input args are empty, expect it creates a error response with default parameters', () => {
      const currentDate: number = Date.now();

      const response: CoreApiResponse<unknown> = CoreApiResponse.error();

      expect(response.code).toBe(Code.INTERNAL_ERROR.code);
      expect(response.message).toBe(Code.INTERNAL_ERROR.message);
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate);
    });

    test('When input args are set, expect it creates a error response with custom parameters', () => {
      const currentDate: number = Date.now();
      const customCode = 404;
      const customMessage = 'Resource not found';
      const customData: Record<string, unknown> = { result: customMessage };

      const response: CoreApiResponse<unknown> = CoreApiResponse.error(
        customCode,
        customMessage,
        customData,
      );

      expect(response.code).toBe(customCode);
      expect(response.message).toBe(customMessage);
      expect(response.data).toBe(customData);
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate);
    });
  });
});
