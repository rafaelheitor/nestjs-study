import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';

@Module({
  imports: [UserModule],
})
export class RootModule {}
