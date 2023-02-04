import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpJwtStrategy } from '@application/api/http-rest/auth/passport/HttpJwtStrategy';
import { HttpLocalStrategy } from '@application/api/http-rest/auth/passport/HttpLocalStrategy';
import { AuthController } from '@application/api/http-rest/controller/AuthController';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './UserModule';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'ASJHASKASHAKSJHASJHKASAKJSHA',
      signOptions: { expiresIn: '60min' },
    }),
  ],
  providers: [HttpAuthService, HttpLocalStrategy, HttpJwtStrategy],
})
export class AuthModule {}
