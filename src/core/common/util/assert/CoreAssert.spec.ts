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
});
