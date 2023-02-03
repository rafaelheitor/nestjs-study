import { User } from '@core/domain/user/entity/User';
import { UserRepositoryInMemory } from './UserRepositoryAdapter';

describe('UserRepositoryInMemory', () => {
  const expectedUser = {
    email: 'email@email.com',
    name: 'user',
    password: '123456',
  };
  const userRepository = new UserRepositoryInMemory();

  test('Should save user', async () => {
    const user: User = await createUser();

    await userRepository.save(user);

    expect(userRepository.users.length > 0);
  });

  test('Should edit user', async () => {
    const user: User = await createUser();
    jest.spyOn(userRepository, 'getByEmail').mockImplementation(async () => {
      return user;
    });

    await user.edit({
      name: 'João',
      password: 'qwerty',
    });
    await userRepository.edit(user);
    const savedUser = await userRepository.getByEmail(expectedUser.email);
    expect(savedUser.getName()).toBe('João');
    expect(savedUser.comparePassword('qwerty')).toBeTruthy;
  });

  test('Should return user if exists in the repository', async () => {
    const user: User = await createUser();

    jest.spyOn(userRepository, 'getByEmail').mockImplementation(async () => {
      return user;
    });

    const foundUser: User = await userRepository.getByEmail(user.getEmail());

    expect(foundUser).toEqual(user);
  });
});

async function createUser() {
  const user: User = await User.new({
    email: 'email@email.com',
    name: 'user',
    password: '123456',
  });

  return user;
}
