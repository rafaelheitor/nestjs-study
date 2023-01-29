import { Module, Provider } from '@nestjs/common';
import { UserDITokens } from 'src/Core/domain/user/di/UserDITokens';
import { UserRepositoryInMemory } from 'src/infrastructure/adapter/persistence/UserRepositoryAdapter';
import { CreateUserService } from 'src/Core/service/user/usecase/CreateUserService';
import { UserController } from '../api/http-rest/controller/UserController';
import { GetUserService } from 'src/core/service/user/usecase/GetUserService';
import { EditUserService } from 'src/core/service/user/usecase/EditUserService';

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
  {
    provide: UserDITokens.GetUserUseCase,
    useFactory: (userRepository) => {
      return new GetUserService(userRepository);
    },
    inject: [UserDITokens.UserRepository],
  },
  {
    provide: UserDITokens.EditUserUseCase,
    useFactory: (userRepository) => new EditUserService(userRepository),
    inject: [UserDITokens.UserRepository],
  },
];

@Module({
  providers: [...persistenceProvider, ...useCaseProviders],
  controllers: [UserController],
})
export class UserModule {}
