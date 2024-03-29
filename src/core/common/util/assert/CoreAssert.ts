import { Optional, Nullable } from '@core/common/type/CommonTypes';

export class CoreAssert {
  public static notEmpty<T>(value: Optional<Nullable<T>>, exception: Error): T {
    if (value === null || value === undefined) {
      throw exception;
    }
    return value;
  }

  public static isFalse(expression: boolean, exception: Error) {
    if (expression) throw exception;
  }
}
