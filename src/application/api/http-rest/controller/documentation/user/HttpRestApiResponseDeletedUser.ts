import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';
import { HttpRestApiModelDeletedUser } from './httpRestApiModelDeletedUser';

export class HttpRestApiResponseDeletedUser extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiModelDeletedUser })
  public data: HttpRestApiModelDeletedUser;
}
