import { CreateUserUseCase } from '../../../domain/user/usecase/CreateUserUsecase';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/userRepositoryPort';
import { UserDITokens } from '../../../domain/user/di/UserDITokens';
import { CreateUserService } from './CreateUserService';
import { CreateUserPort } from '../../../domain/user/port/useCase/CreateUserPort';
import { UserUsecaseDto } from '../../../domain/user/usecase/dto/UserUsecaseDto';
import { User } from '../../../domain/user/entity/User';
import { UserRepositoryInMemory } from '../../../../infrastructure/adapter/persistence/UserRepositoryAdapter';
import { Exception } from '../../../common/exception/Exception';
import { ClassValidationDetails } from '../../../common/util/classValidator/ClassValidator';
import { v4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { Code } from '../../../common/code/Code';

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

      const resultAddedUser: User = jest.spyOn(userRepository, 'save')
        .mock[0][0].calls;

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
