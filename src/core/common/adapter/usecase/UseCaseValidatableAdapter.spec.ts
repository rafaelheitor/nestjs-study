import { IsString } from 'class-validator';
import { Code } from '../../code/Code';
import { Exception } from '../../exception/Exception';
import { ClassValidationDetails } from '../../util/classValidator/ClassValidator';
import { UseCaseValidatableAdapter } from './UseCaseValidatableAdapter';

class MockAdapter extends UseCaseValidatableAdapter {
  @IsString()
  public stringProperty: string;

  constructor(stringProperty: string) {
    super();
    this.stringProperty = stringProperty;
  }
}

describe('UseCaseValidatableAdapter', () => {
  test("When properties are valid, expect it doesn't throw a Exception", async () => {
    const validAdapter: MockAdapter = new MockAdapter('Test string');

    await expect(validAdapter.validate()).resolves.toBeUndefined;
  });

  test('When properties are not valid, expect it throw a Exception', async () => {
    const invalidProperty: unknown = 45;
    const invalidInstance: MockAdapter = new MockAdapter(
      invalidProperty as string,
    );

    expect.hasAssertions();

    try {
      await invalidInstance.validate();
    } catch (e) {
      const exception: Exception<ClassValidationDetails> =
        e as Exception<ClassValidationDetails>;
      expect(exception).toBeInstanceOf(Exception);
      expect(exception.code).toBe(Code.USE_CASE_PORT_VALIDATION_ERROR.code);
      expect(exception.data!.errors[0].property).toBe('stringProperty');
    }
  });
});
