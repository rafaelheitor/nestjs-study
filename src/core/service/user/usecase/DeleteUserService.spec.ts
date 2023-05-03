import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { DeleteUserUseCase } from '@core/domain/user/usecase/DeleteUserUseCase';
import { DeleteUserUseCaseDto } from '@core/domain/user/usecase/dto/DeleteUserUseCaseDto';
import { UserRepositoryInMemory } from '@infrastructure/adapter/persistence/UserRepositoryAdapter';
import { DeleteUserService } from './DeleteUserService';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { Code } from '@core/common/code/Code';

describe('DeleteUserService', () => {
  let deleteUserService: DeleteUserUseCase;
  let userRepository: UserRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: UserDITokens.DeleteUserUseCase,
          useFactory: (userRepository) => new DeleteUserService(userRepository),
          inject: [UserDITokens.UserRepository],
        },
      ],
    }).compile();

    deleteUserService = module.get<DeleteUserUseCase>(
      UserDITokens.DeleteUserUseCase,
    );
    userRepository = module.get<UserRepositoryPort>(
      UserDITokens.UserRepository,
    );
  });

  test('Should delete User if user was found', async () => {
    const customRemovedAt: Date = new Date(Date.now() - 5000);
    const mockUser: User = await User.new({
      name: 'Rafael',
      email: 'email@email.com',
      password: '123456',
      removedAt: customRemovedAt,
    });

    jest.spyOn(userRepository, 'getOne').mockImplementation(async () => {
      return mockUser;
    });
    const deleteMethod = jest.spyOn(userRepository, 'delete');

    const expectedDeleteUserDto: DeleteUserUseCaseDto =
      DeleteUserUseCaseDto.newFromUser(mockUser);

    const resultDeleteUserDto: DeleteUserUseCaseDto =
      await deleteUserService.execute({
        id: mockUser.getId(),
      });

    Reflect.set(expectedDeleteUserDto, 'removedAt', customRemovedAt);
    Reflect.set(resultDeleteUserDto, 'removedAt', customRemovedAt);

    expect(expectedDeleteUserDto).toEqual(resultDeleteUserDto);
    expect(deleteMethod).toHaveBeenCalledWith(mockUser.getEmail());
  });

  test('When user is not found, expect it throws exception', async () => {
    jest
      .spyOn(userRepository, 'getOne')
      .mockImplementation(async () => undefined);
    expect.hasAssertions();

    try {
      const userPort = 'userid';
      await deleteUserService.execute({ id: userPort });
    } catch (error) {
      const exception: Exception<ClassValidationDetails> =
        error as Exception<ClassValidationDetails>;

      expect(exception).toBeInstanceOf(Exception);
      expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
    }
  });
});
