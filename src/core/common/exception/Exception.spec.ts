import { Code } from '@core/common/code/Code';
import { Exception } from './Exception';

describe('Exception test', () => {
  test('when input data and overrideMessage are empty, expect it creates a Exception instance with default parameters', () => {
    const exception: Exception<void> = Exception.new({
      code: Code.BAD_REQUEST_ERROR,
    });

    expect(exception.code).toBe(Code.BAD_REQUEST_ERROR.code);
    expect(exception.message).toBe(Code.BAD_REQUEST_ERROR.message);
    expect(exception.data).toBeUndefined;
  });

  test('When input data and overrideMessage args are set, expect it creates a Exception instance with custom parameters', () => {
    const customMessage: string = 'Custom Internal Error';
    const customData: Record<string, unknown> = {
      result: 'Custom internal Error',
    };
    const exception: Exception<Record<string, unknown>> = Exception.new({
      code: Code.BAD_REQUEST_ERROR,
      overrideMessage: customMessage,
      data: customData,
    });

    expect(exception.code).toBe(Code.BAD_REQUEST_ERROR.code);
    expect(exception.message).toBe(customMessage);
    expect(exception.data).toBe(customData);
  });
});
