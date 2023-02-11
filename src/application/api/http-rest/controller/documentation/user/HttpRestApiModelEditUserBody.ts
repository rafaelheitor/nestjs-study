import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelEditUserBody {
  @ApiProperty({ type: 'string', required: false })
  public name: string;

  @ApiProperty({ type: 'string', required: false })
  public password: string;
}
