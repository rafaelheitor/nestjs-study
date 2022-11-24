import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './repository/User.repository';
@Module({
    imports: [PrismaModule],
    providers:[UserRepository],
    exports:[UserRepository]
})
export class UserModule {}
