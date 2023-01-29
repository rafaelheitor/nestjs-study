import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryInMemory } from '../../../../infrastructure/adapter/persistence/UserRepositoryAdapter';
import { v4 } from 'uuid';
import { UserDITokens } from '../../../domain/user/di/UserDITokens';
import { User } from '../../../domain/user/entity/User';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/userRepositoryPort';
import { EditUserPort } from '../../../domain/user/port/useCase/EditUserPort';
import { UserUsecaseDto } from '../../../domain/user/usecase/dto/UserUsecaseDto';
import { EditUserUseCase } from '../../../domain/user/usecase/EditUserUseCase';
import { EditUserService } from './EditUserService';

describe('EditUserService', () => {
  let userRepository: UserRepositoryPort;
  let editUserService: EditUserUseCase;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: UserDITokens.EditUserUseCase,
          useFactory: (userRepository) => new EditUserService(userRepository),
          inject: [UserDITokens.UserRepository],
        },
      ],
    }).compile();

    userRepository = module.get<UserRepositoryPort>(
      UserDITokens.UserRepository,
    );

    editUserService = module.get<EditUserUseCase>(UserDITokens.EditUserUseCase);
  });
  describe('Found User', () => {
    test('When user is found, expect it edits user', async () => {
      const mockUser: User = await User.new({
        id: v4(),
        name: 'Nome',
        password: '123456',
        email: 'firstemail@email.com',
      });

      const editUserPort: EditUserPort = {
        email: 'firstemail@email.com',
        name: 'Novo Nome',
        password: 'novopassword',
      };

      const mockEdited: User = await mockUser.edit({
        name: editUserPort.name,
        password: editUserPort.password,
      });

      jest.spyOn(userRepository, 'getByEmail').mockImplementation(async () => {
        return mockUser;
      });

      jest
        .spyOn(userRepository, 'edit')
        .mockImplementation(async () => mockEdited);

      jest.spyOn(userRepository, 'edit').mockClear();

      const expectedUserUseCaseDto: UserUsecaseDto =
        UserUsecaseDto.newFromUser(mockUser);

      const resultUserUseCaseDto: UserUsecaseDto =
        await editUserService.execute(editUserPort);

      const result: User = jest.spyOn(userRepository, 'edit').mock.calls[0][0];
      const customEditedAt = new Date(Date.now() - 3000);

      Reflect.set(result, 'editedAt', customEditedAt);
      Reflect.set(resultUserUseCaseDto, 'editedAt', customEditedAt);
      Reflect.set(expectedUserUseCaseDto, 'editedAt', customEditedAt);

      expect(expectedUserUseCaseDto).toEqual(resultUserUseCaseDto);
      expect(resultUserUseCaseDto.name).toBe(editUserPort.name);
      expect(resultUserUseCaseDto.editedAt.getTime()).toBe(
        result.getEditedAt()!.getTime(),
      );
    });
  });
});
