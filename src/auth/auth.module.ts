import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'ASASASALSKSALKS',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
