import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';
import { HttpRestApiModelProductDeleted } from './HttpRestApiModelProductDeleted';

export class HttpRestApiResponseProduct extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiModelProductDeleted })
  public data: HttpRestApiModelProductDeleted;
}
