import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '../../../domain/user/di/UserDITokens';
import { User } from '../../../domain/user/entity/User';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/userRepositoryPort';
import { DeleteUserUseCase } from '../../../domain/user/usecase/DeleteUserUseCase';
import { DeleteUserUseCaseDto } from '../../../domain/user/usecase/dto/DeleteUserUseCaseDto';
import { UserRepositoryInMemory } from '../../../../infrastructure/adapter/persistence/UserRepositoryAdapter';
import { DeleteUserService } from './DeleteUserService';

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

    jest.spyOn(userRepository, 'getByEmail').mockImplementation(async () => {
      return mockUser;
    });
    const deleteMethod = jest.spyOn(userRepository, 'delete');

    const expectedDeleteUserDto: DeleteUserUseCaseDto =
      DeleteUserUseCaseDto.newFromUser(mockUser);

    const resultDeleteUserDto: DeleteUserUseCaseDto =
      await deleteUserService.execute({
        email: mockUser.getEmail(),
      });

    Reflect.set(expectedDeleteUserDto, 'removedAt', customRemovedAt);
    Reflect.set(resultDeleteUserDto, 'removedAt', customRemovedAt);

    expect(expectedDeleteUserDto).toEqual(resultDeleteUserDto);
    expect(deleteMethod).toHaveBeenCalledWith(mockUser.getEmail());
  });
});
