import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpAuthService } from '../auth/HttpAuthService';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: HttpAuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  public async login(@Req() request) {
    return request.user;
  }
}
