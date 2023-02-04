import { Code } from '@core/common/code/Code';
import { UserRoles } from '@core/common/enums/UserEnums';
import { Exception } from '@core/common/exception/Exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { HttpRequestWithUser } from '../type/HttpAuthTypes';

@Injectable()
export class HttpRoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserRoles[] =
      this.reflector.get<UserRoles[]>('roles', context.getHandler()) || [];
    const request: HttpRequestWithUser = context.switchToHttp().getRequest();

    const canActivate: boolean =
      roles.length > 0 ? roles.includes(request.user.role) : true;

    if (!canActivate) {
      throw Exception.new({ code: Code.ACCESS_DENIED_ERROR });
    }

    return canActivate;
  }
}
