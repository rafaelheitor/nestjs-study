import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';
import { HttpRestApiModelEditUser } from './HttpRestApiModelEditUser';

export class HttpRestApiResponseEditedUser extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiModelEditUser })
  public data: HttpRestApiModelEditUser;
}
