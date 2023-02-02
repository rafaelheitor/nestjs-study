import { CreateUserUseCase } from '@core/domain/user/usecase/CreateUserUsecase';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { CreateUserService } from './CreateUserService';
import { CreateUserPort } from '@core/domain/user/port/useCase/CreateUserPort';
import { UserUsecaseDto } from '@core/domain/user/usecase/dto/UserUsecaseDto';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryInMemory } from '@infrastructure/adapter/persistence/UserRepositoryAdapter';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { Code } from '@core/common/code/Code';

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
      Reflect.set(
        resultUserUseCaseDto,
        'createdAt',
        expectedUser.getCreatedAt(),
      );
      Reflect.set(
        expectedUserUseCaseDto,
        'createdAt',
        expectedUser.getCreatedAt(),
      );

      expect(resultUserUseCaseDto).toEqual(expectedUserUseCaseDto);
      expect(resultAddedUser).toEqual(expectedUser);
    });

    it('Should throw exception if a user already exists', async () => {
      const userPort: CreateUserPort = createPort();

      const mockUser: User = await User.new({
        id: userPort.id,
        name: userPort.name,
        email: userPort.email,
        password: userPort.password,
      });

      jest
        .spyOn(userRepository, 'getByEmail')
        .mockImplementation(async () => mockUser);

      expect.hasAssertions();

      try {
        await createUserService.execute(userPort);
      } catch (error) {
        const exception: Exception<ClassValidationDetails> =
          error as Exception<ClassValidationDetails>;

        expect(exception.code).toBe(Code.ENTITY_ALREADY_EXISTS_ERROR.code);
        expect(exception).toBeInstanceOf(Exception);
      }
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
