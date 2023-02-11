import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelProductDeleted {
  @ApiProperty({ type: 'string' })
  public id: string;

  @ApiProperty({ type: 'string' })
  public name: string;

  @ApiProperty({ type: 'string' })
  public removedAt: Date;
}
