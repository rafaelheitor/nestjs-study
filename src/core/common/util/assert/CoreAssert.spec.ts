import { CoreAssert } from './CoreAssert';

describe('CoreAssert', () => {
  const AssertionError: Error = new Error('AssertionError');
  describe('notEmpty', () => {
    test('When expression is not <null | undefined> expect it returns expression', () => {
      expect(CoreAssert.notEmpty({}, AssertionError)).toEqual({});
    });

    test('When expression is undefined, expect it throws error', () => {
      expect.hasAssertions();

      try {
        CoreAssert.notEmpty(undefined, AssertionError);
      } catch (error) {
        expect(error).toEqual(AssertionError);
      }
    });
  });

  describe('isFalse', () => {
    test("When expressions is false, expect it doesn' throw a exception", () => {
      expect(CoreAssert.isFalse(false, AssertionError)).toBeUndefined();
    });

    test('When expression is not false, expect it throw a exception', () => {
      expect.hasAssertions();

      try {
        CoreAssert.isFalse(true, AssertionError);
      } catch (error) {
        expect(error).toBe(AssertionError);
      }
    });
  });
});
