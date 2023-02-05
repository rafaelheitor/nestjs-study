import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpJwtStrategy } from '@application/api/http-rest/auth/passport/HttpJwtStrategy';
import { HttpLocalStrategy } from '@application/api/http-rest/auth/passport/HttpLocalStrategy';
import { AuthController } from '@application/api/http-rest/controller/AuthController';
import { config } from '@infrastructure/config/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { InfrastructureModule } from './Infrastructure';
import { UserModule } from './UserModule';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    InfrastructureModule,
    JwtModule.register({
      secret: config().ApiServerConfig.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60min' },
    }),
  ],
  providers: [HttpAuthService, HttpLocalStrategy, HttpJwtStrategy],
})
export class AuthModule {}
