import { Module } from '@nestjs/common';
import { InfrastructureModule } from './Infrastructure';
import { UserModule } from './UserModule';

@Module({
  imports: [UserModule, InfrastructureModule],
})
export class RootModule {}
