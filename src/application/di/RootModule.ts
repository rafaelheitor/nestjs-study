import { Module } from '@nestjs/common';
import { AuthModule } from './AuthModule';
import { InfrastructureModule } from './Infrastructure';
import { UserModule } from './UserModule';

@Module({
  imports: [UserModule, InfrastructureModule, AuthModule],
})
export class RootModule {}
