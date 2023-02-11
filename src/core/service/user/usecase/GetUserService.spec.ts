import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { CreateUserPort } from '@core/domain/user/port/useCase/CreateUserPort';
import { UserUsecaseDto } from '@core/domain/user/usecase/dto/UserUsecaseDto';
import { GetUserUseCase } from '@core/domain/user/usecase/getUserUseCase';
import { UserRepositoryInMemory } from '@infrastructure/adapter/persistence/UserRepositoryAdapter';
import { GetUserService } from './GetUserService';
import { GetUserPort } from '@core/domain/user/port/useCase/GetUserPort';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { Code } from '@core/common/code/Code';
import { v4 } from 'uuid';

describe('Tests GetUserService', () => {
  let getUserService: GetUserUseCase;
  let userRepository: UserRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: UserDITokens.GetUserUseCase,
          useFactory: (userRepository) => new GetUserService(userRepository),
          inject: [UserDITokens.UserRepository],
        },
      ],
    }).compile();

    getUserService = module.get<GetUserUseCase>(UserDITokens.GetUserUseCase);

    userRepository = module.get<UserRepositoryPort>(
      UserDITokens.UserRepository,
    );
  });
  describe('Execute Module', () => {
    test('When user is valid, expect it find user in repository', async () => {
      const userPort: CreateUserPort = createPort();
      const mockUser: User = await User.new(userPort);

      jest.spyOn(userRepository, 'getById').mockImplementation(async () => {
        return mockUser;
      });

      const expectedUser: UserUsecaseDto = UserUsecaseDto.newFromUser(mockUser);
      const resultUser: UserUsecaseDto = await getUserService.execute({
        id: mockUser.getId(),
      });

      expect(resultUser).toEqual(expectedUser);
    });

    test('If user was not found, expect it throws exception', async () => {
      jest
        .spyOn(userRepository, 'getById')
        .mockImplementation(async () => undefined);

      expect.hasAssertions();

      try {
        const getUserPort: GetUserPort = { id: 'user@email.com' };
        await getUserService.execute(getUserPort);
      } catch (error) {
        const exception: Exception<ClassValidationDetails> =
          error as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
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
