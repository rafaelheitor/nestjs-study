import { UserRoles } from '@core/common/enums/UserEnums';

export interface CreateUserPort {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: UserRoles;
}
