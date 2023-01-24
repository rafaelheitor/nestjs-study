import { Module, Provider } from '@nestjs/common';
import { UserDITokens } from 'src/Core/common/di/UserDITokens';
import { UserRepositoryInMemory } from 'src/infrastructure/adapter/persistence/UserRepositoryAdapter';
import { CreateUserService } from 'src/Core/service/user/usecase/CreateUserService';
import { UserController } from '../api/http-rest/controller/UserController';

const persistenceProvider: Provider[] = [
  {
    provide: UserDITokens.UserRepository,
    useClass: UserRepositoryInMemory,
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: UserDITokens.CreateUserUseCase,
    useFactory: (userRepository) => {
      return new CreateUserService(userRepository);
    },
    inject: [UserDITokens.UserRepository],
  },
];

@Module({
  providers: [...persistenceProvider, ...useCaseProviders],
  controllers: [UserController],
})
export class UserModule {}
