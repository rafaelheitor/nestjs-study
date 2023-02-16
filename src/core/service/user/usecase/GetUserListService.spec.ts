import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { UserUsecaseDto } from '@core/domain/user/usecase/dto/UserUsecaseDto';
import { GetUserListUseCase } from '@core/domain/user/usecase/GetUserListUseCase';
import { UserRepositoryInMemory } from '@infrastructure/adapter/persistence/UserRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserListService } from './GetUserListService';

describe('GetUserListService', () => {
  let getUserListUseCase: GetUserListUseCase;
  let userRepository: UserRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: UserDITokens.GetUserListUseCase,
          useFactory: (userRepository) =>
            new GetUserListService(userRepository),
          inject: [UserDITokens.UserRepository],
        },
      ],
    }).compile();
    getUserListUseCase = module.get<GetUserListUseCase>(
      UserDITokens.GetUserListUseCase,
    );
    userRepository = module.get<UserRepositoryPort>(
      UserDITokens.UserRepository,
    );
  });

  test('Should return all Users saved in repository', async () => {
    const user: User = await createUser();
    const mockUserList: User[] = [user];

    jest.spyOn(userRepository, 'getAll').mockImplementation(async () => {
      return mockUserList;
    });

    const expectedUserDto: UserUsecaseDto[] =
      UserUsecaseDto.newListFromUser(mockUserList);
    const resultUserDto: UserUsecaseDto[] = await getUserListUseCase.execute();

    expect(expectedUserDto).toStrictEqual(resultUserDto);
  });
});

async function createUser() {
  return User.new({
    name: 'Mock user name',
    email: 'mock@email.com',
    password: 'Mock@123',
  });
}
