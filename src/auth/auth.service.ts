import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon from 'argon2';
import { User } from '../common/domain/user/Entity/User';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(email: string, password: string) {
    const user = this.userService.getByEmail(email);

    if (!user) {
      return null;
    }

    const passwordIsValid = argon.verify((await user).hash, password);

    return passwordIsValid ? user : null;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      password: user.hash,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async verify(token: string) {}
}
