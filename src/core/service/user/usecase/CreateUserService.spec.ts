import { CreateUserUseCase } from '../../../domain/user/usecase/CreateUserUsecase';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/userRepositoryPort';
import { UserDITokens } from '../../../domain/user/di/UserDITokens';
import { CreateUserService } from './CreateUserService';
import { CreateUserPort } from '../../../domain/user/port/useCase/CreateUserPort';
import { UserUsecaseDto } from '../../../domain/user/usecase/dto/UserUsecaseDto';
import { User } from '../../../domain/user/entity/user.entity';
import { UserRepositoryInMemory } from '../../../../infrastructure/adapter/persistence/UserRepositoryAdapter';
import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';

describe('Tests CreateUserService', () => {
  let createUserService: CreateUserUseCase;
  let userRepository: UserRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.CreateUserUseCase,
          useFactory: (userRepository) => new CreateUserService(userRepository),
          inject: [UserDITokens.UserRepository],
        },
        {
          provide: UserDITokens.UserRepository,
          useClass: UserRepositoryInMemory,
        },
      ],
    }).compile();

    createUserService = module.get<CreateUserUseCase>(
      UserDITokens.CreateUserUseCase,
    );
    userRepository = module.get<UserRepositoryPort>(
      UserDITokens.UserRepository,
    );
  });

  describe('Execute Module', () => {
    it('Should create a new user with required parameters', async () => {
      const userPort: CreateUserPort = createPort();

      const expectedUser: User = await User.new({
        id: userPort.id,
        name: userPort.name,
        email: userPort.email,
        password: userPort.password,
      });

      jest.spyOn(userRepository, 'save').mockImplementation(async () => {
        return expectedUser;
      });
      jest.spyOn(userRepository, 'save').mockClear();

      const expectedUserUseCaseDto: UserUsecaseDto =
        await UserUsecaseDto.newFromUser(expectedUser);

      const resultUserUseCaseDto: UserUsecaseDto =
        await createUserService.execute(userPort);

      const resultAddedUser: User = jest.spyOn(userRepository, 'save').mock
        .calls[0][0];

      Reflect.set(resultAddedUser, 'password', expectedUser.getPassword());
      Reflect.set(resultAddedUser, 'createdAt', expectedUser.getCreatedAt());

      expect(resultUserUseCaseDto).toEqual(expectedUserUseCaseDto);
      expect(resultAddedUser).toEqual(expectedUser);
    });
  });
});

function createPort(): CreateUserPort {
  return {
    id: v4(),
    name: v4(),
    email: 'user@email.com',
    password: '1234556',
  };
}
