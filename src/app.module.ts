import { Module } from '@nestjs/common';
import { UserModule } from './application/di/UserModule';

@Module({
  imports: [UserModule],
})
export class AppModule {}
