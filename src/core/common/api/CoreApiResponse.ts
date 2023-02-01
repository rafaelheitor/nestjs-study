import { Code } from '../code/Code';
import { Nullable } from '../type/CommonTypes';

export class CoreApiResponse<Tdata> {
  public readonly code: number;

  public readonly message: string;

  public readonly timestamp: number;

  public readonly data: Nullable<Tdata>;

  private constructor(code: number, message: string, data?: Tdata) {
    this.code = code;
    this.message = message;
    this.data = data || null;
    this.timestamp = Date.now();
  }

  public static success<Tdata>(
    message?: string,
    data?: Tdata,
  ): CoreApiResponse<Tdata> {
    const resultCode: number = Code.SUCCESS.code;

    const resultMessage: string = message || Code.SUCCESS.message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }

  public static error<Tdata>(
    code?: number,
    message?: string,
    data?: Tdata,
  ): CoreApiResponse<Tdata> {
    const resultCode: number = code || Code.INTERNAL_ERROR.code;
    const resultMessage: string = message || Code.INTERNAL_ERROR.message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }
}