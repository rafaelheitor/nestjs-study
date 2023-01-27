import { IsNumber, IsString } from 'class-validator';
import { Optional } from '../../type/CommonTypes';
import { ClassValidationDetails, ClassValidator } from './ClassValidator';

class MockClass {
  @IsString()
  public stringProperty: string;

  @IsNumber()
  public numberProperty: number;

  constructor(stringProperty: string, numberProperty: number) {
    this.stringProperty = stringProperty;
    this.numberProperty = numberProperty;
  }
}
describe('ClassValidator', () => {
  describe('Validate', () => {
    test("When MockClass is valid, expect it doesn't return validation details", async () => {
      const validInstance: MockClass = new MockClass('String', 33);
      await expect(
        ClassValidator.validate(validInstance),
      ).resolves.toBeUndefined();
    });
  });

  test('When MockClass is not valid, expect it returns object validation details', async () => {
    const stringProperty: unknown = 33;
    const numberProperty: unknown = '33';

    const invalidInstance: MockClass = new MockClass(
      stringProperty as string,
      numberProperty as number,
    );
    const validationDetails: Optional<ClassValidationDetails> =
      await ClassValidator.validate(invalidInstance);

    expect(validationDetails).toBeDefined();
    expect(validationDetails!.context).toBe('MockClass');
    expect(validationDetails!.errors[0].property).toBe('stringProperty');
    expect(validationDetails!.errors[1].property).toBe('numberProperty');
  });
});
