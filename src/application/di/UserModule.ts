import { Module, Provider } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { UserRepositoryInMemory } from '@infrastructure/adapter/persistence/UserRepositoryAdapter';
import { CreateUserService } from '@core/service/user/usecase/CreateUserService';
import { UserController } from '@application/api/http-rest/controller/UserController';
import { GetUserService } from '@core/service/user/usecase/GetUserService';
import { EditUserService } from '@core/service/user/usecase/EditUserService';
import { DeleteUserService } from '@core/service/user/usecase/DeleteUserService';

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
  {
    provide: UserDITokens.DeleteUserUseCase,
    useFactory: (userRepository) => new DeleteUserService(userRepository),
    inject: [UserDITokens.UserRepository],
  },
];

@Module({
  providers: [...persistenceProvider, ...useCaseProviders],
  controllers: [UserController],
  exports: [UserDITokens.UserRepository],
})
export class UserModule {}
