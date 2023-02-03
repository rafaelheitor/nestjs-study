import { Optional } from '@core/common/type/CommonTypes';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class HttpAuthService {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  public async validate(username: string, password: string) {
    const user: Optional<User> = await this.userRepository.getByEmail(username);

    if (user) {
      const isPasswordValid: boolean = await user.comparePassword(password);
      if (isPasswordValid) {
        return { id: user.getId(), email: user.getEmail() };
      }
    }
    return null;
  }
}
