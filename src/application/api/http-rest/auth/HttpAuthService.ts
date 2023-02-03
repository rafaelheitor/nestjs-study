import { Optional } from '@core/common/type/CommonTypes';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import {
  HttpJwtPayload,
  HttpLoggedInUser,
  HttpUserPayload,
} from './type/HttpAuthTypes';

@Injectable()
export class HttpAuthService {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,

    private readonly jwtService: JwtService,
  ) {}

  public async validate(username: string, password: string) {
    const user: Optional<User> = await this.userRepository.getByEmail(username);

    if (user) {
      const isPasswordValid: boolean = await user.comparePassword(password);
      if (isPasswordValid) {
        return {
          id: user.getId(),
          email: user.getEmail(),
          role: user.getRole(),
        };
      }
    }
    return null;
  }

  public async getUser(email: string): Promise<Optional<User>> {
    return this.userRepository.getByEmail(email);
  }

  public login(user: HttpUserPayload): HttpLoggedInUser {
    const payload: HttpJwtPayload = { email: user.email };

    return {
      id: user.id,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
