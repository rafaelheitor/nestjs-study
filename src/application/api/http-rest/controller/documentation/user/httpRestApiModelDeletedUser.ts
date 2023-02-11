import { UserRoles } from '@core/common/enums/UserEnums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelDeletedUser {
  @ApiProperty({ type: 'string' })
  public name: string;

  @ApiProperty({ type: 'string' })
  public removedAt: Date;
}
