import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiModelProduct } from './HttpRestApiModelProduct';

export class HttpRestApiResponseProductList {
  @ApiProperty({ type: HttpRestApiModelProduct, isArray: true })
  public data: HttpRestApiModelProduct[];
}
