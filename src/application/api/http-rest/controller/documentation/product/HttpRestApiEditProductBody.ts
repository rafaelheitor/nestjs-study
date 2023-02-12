import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiEditProductBody {
  @ApiProperty({ type: 'string', required: false })
  public name: string;

  @ApiProperty({ type: 'string', required: false })
  public image: string;

  @ApiProperty({ type: 'number', required: false })
  public price: number;

  @ApiProperty({ type: 'number', required: false })
  public quantity: number;
}
