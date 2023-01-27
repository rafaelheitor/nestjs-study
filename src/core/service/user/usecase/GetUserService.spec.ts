import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '../../../domain/user/di/UserDITokens';
import { User } from '../../../domain/user/entity/User';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/userRepositoryPort';
import { CreateUserPort } from '../../../domain/user/port/useCase/CreateUserPort';
import { UserUsecaseDto } from '../../../domain/user/usecase/dto/UserUsecaseDto';
import { GetUserUseCase } from '../../../domain/user/usecase/getUserUseCase';
import { UserRepositoryInMemory } from '../../../../infrastructure/adapter/persistence/UserRepositoryAdapter';
import { GetUserService } from './GetUserService';
import { GetUserPort } from '../../../domain/user/port/useCase/GetUserPort';
import { Exception } from '../../../common/exception/Exception';
import { ClassValidationDetails } from '../../../common/util/classValidator/ClassValidator';
import { Code } from '../../../common/code/Code';
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
    test('When user is valide, expect it find user in repository', async () => {
      const userPort: CreateUserPort = createPort();
      const mockUser: User = await User.new(userPort);

      jest.spyOn(userRepository, 'getByEmail').mockImplementation(async () => {
        return mockUser;
      });

      const expectedUser: UserUsecaseDto = UserUsecaseDto.newFromUser(mockUser);
      const resultUser: UserUsecaseDto = await getUserService.execute({
        email: mockUser.getEmail(),
      });

      expect(resultUser).toEqual(expectedUser);
    });

    test('When user is not found, expect it throws exception', async () => {
      jest
        .spyOn(userRepository, 'getByEmail')
        .mockImplementation(async () => undefined);

      expect.hasAssertions();

      try {
        const getUserPort: GetUserPort = { email: 'user@email.com' };
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
