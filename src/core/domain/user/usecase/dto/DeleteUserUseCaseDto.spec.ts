import { User } from '../../entity/User';
import { DeleteUserUseCaseDto } from './DeleteUserUseCaseDto';

describe('DeleteUserUseCaseDto', () => {
  test('Should return DeleteUserUseCaseDto', async () => {
    const customRemovedAt: Date = new Date(Date.now() - 5000);

    const mockUser: User = await User.new({
      name: 'Rafael',
      password: '123456',
      email: 'email@email.com',
      removedAt: customRemovedAt,
    });

    const deleteUserDTo: DeleteUserUseCaseDto =
      DeleteUserUseCaseDto.newFromUser(mockUser);

    expect(deleteUserDTo.name).toBe(mockUser.getName());
    expect(deleteUserDTo.removedAt).toEqual(mockUser.getRemovedAt());
  });
});
