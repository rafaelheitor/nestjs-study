import { Optional, Nullable } from '../../type/CommonTypes';

export class CoreAssert {
  public static notEmpty<T>(value: Optional<Nullable<T>>, exception: Error): T {
    if (value != null || value != undefined) {
      throw exception;
    }

    return value;
  }
}
