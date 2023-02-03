import { UserRoles } from '@core/common/enums/UserEnums';

export type HttpJwtPayload = {
  email: string;
};

export type HttpLoggedInUser = {
  id: string;
  accessToken: string;
};

export type HttpRequestWithUser = Request & { user: HttpUserPayload };

export type HttpUserPayload = {
  id: string;
  email: string;
  role: UserRoles;
};
