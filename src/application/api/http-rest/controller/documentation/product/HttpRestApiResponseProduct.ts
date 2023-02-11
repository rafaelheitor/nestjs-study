import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';
import { HttpRestApiModelProduct } from './HttpRestApiModelProduct';

export class HttpRestApiResponseProduct extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiModelProduct })
  public data: HttpRestApiModelProduct;
}
