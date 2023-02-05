import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { User } from '@core/domain/user/entity/User';
import { config } from '@infrastructure/config/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { HttpAuthService } from '../HttpAuthService';
import { HttpJwtPayload, HttpUserPayload } from '../type/HttpAuthTypes';

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: HttpAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(
        config().ApiServerConfig.API_ACCESS_TOKEN_HEADER,
      ),
      ignoreExpiration: false,
      secretOrKey: config().ApiServerConfig.ACCESS_TOKEN_SECRET,
    });
  }

  public async validate(payload: HttpJwtPayload): Promise<HttpUserPayload> {
    const user: User = CoreAssert.notEmpty(
      await this.authService.getUser(payload.email),
      Exception.new({
        code: Code.UNAUTHORIZED_ERROR,
        overrideMessage: 'You shall not pass',
      }),
    );

    return { id: user.getId(), email: user.getEmail(), role: user.getRole() };
  }
}
