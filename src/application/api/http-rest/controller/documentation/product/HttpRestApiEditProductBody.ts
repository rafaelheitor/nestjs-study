import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiEditProductBody {
  @ApiProperty({ type: 'string' })
  public name: string;

  @ApiProperty({ type: 'string' })
  public image: string;

  @ApiProperty({ type: 'number' })
  public price: number;

  @ApiProperty({ type: 'number' })
  public quantity: number;
}
