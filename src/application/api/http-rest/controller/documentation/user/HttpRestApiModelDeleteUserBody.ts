import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelDeleteUserBody {
  @ApiProperty({ type: 'string' })
  public email: string;
}
