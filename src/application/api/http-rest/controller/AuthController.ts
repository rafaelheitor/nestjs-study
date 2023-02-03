import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { HttpLocalAuthGuard } from '../auth/guard/HttpLocalAuthGuard';
import { HttpAuthService } from '../auth/HttpAuthService';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: HttpAuthService) {}

  @Post('login')
  @UseGuards(HttpLocalAuthGuard)
  public async login(@Req() request) {
    return request.user;
  }
}
