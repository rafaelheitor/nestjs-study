import { Code } from '@core/common/code/Code';
import { UserRoles } from '@core/common/enums/UserEnums';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { HttpAuthService } from '../HttpAuthService';
import { HttpUserPayload } from '../type/HttpAuthTypes';

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: HttpAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  public async validate(username: string, password: string) {
    const user: HttpUserPayload = CoreAssert.notEmpty(
      await this.authService.validate(username, password),
      Exception.new({
        code: Code.WRONG_CREDENTIALS_ERROR,
      }),
    );
    return user;
  }
}
