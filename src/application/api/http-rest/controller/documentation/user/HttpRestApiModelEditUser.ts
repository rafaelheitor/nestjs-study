import { UserRoles } from '@core/common/enums/UserEnums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelEditUser {
  @ApiProperty({ type: 'string' })
  public id: string;

  @ApiProperty({ type: 'string' })
  public name: string;

  @ApiProperty({ type: 'string' })
  public email: string;

  @ApiProperty({ type: 'string' })
  public role: UserRoles;

  @ApiProperty({ type: 'string' })
  public createdAt: Date;

  @ApiProperty({ type: 'string' })
  public editedAt: Date;
}
