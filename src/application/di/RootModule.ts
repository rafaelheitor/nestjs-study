import { Module } from '@nestjs/common';
import { AuthModule } from './AuthModule';
import { InfrastructureModule } from './Infrastructure';
import { ProductModule } from './ProductModule';
import { UserModule } from './UserModule';

@Module({
  imports: [UserModule, InfrastructureModule, AuthModule, ProductModule],
})
export class RootModule {}
