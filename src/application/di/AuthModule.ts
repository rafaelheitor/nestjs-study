import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpLocalStrategy } from '@application/api/http-rest/auth/passport/HttpLocalStrategy';
import { AuthController } from '@application/api/http-rest/controller/AuthController';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './UserModule';

@Module({
  controllers: [AuthController],
  imports: [UserModule, PassportModule],
  providers: [HttpAuthService, HttpLocalStrategy],
})
export class AuthModule {}
