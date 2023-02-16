import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiModelUser } from './HttpRestApiModelUser';

export class HttpRestApiResponseUserList {
  @ApiProperty({ type: HttpRestApiModelUser, isArray: true })
  public data: HttpRestApiModelUser[];
}
