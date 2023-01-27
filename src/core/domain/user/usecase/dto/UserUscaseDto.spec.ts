import { createUserPayload, User } from '../../entity/User';
import { UserUsecaseDto } from './UserUsecaseDto';

describe('Tests the UserUsecaseDto', () => {
  it('should create a new user dto', async () => {
    const user = await createUser();
    const userDto: UserUsecaseDto = UserUsecaseDto.newFromUser(user);

    expect(user.getName()).toBe(userDto.name);
    expect(user.getId()).toBe(userDto.id);
    expect(user.getEmail()).toBe(userDto.email);
  });

  it('Should Create a list from User dto', async () => {
    const user: User = await createUser();
    const user2: User = await createUser();
    const user3: User = await createUser();
    const user4: User = await createUser();
    const users: User[] = [user, user2, user3, user4];

    const listFromDto: UserUsecaseDto[] = UserUsecaseDto.newListFromUser(users);
    expect(listFromDto[0] instanceof UserUsecaseDto).toBeTruthy();
  });
});

async function createUser(id?: string) {
  const userPayload: createUserPayload = {
    name: 'Rafael',
    email: 'rafael@email.com',
    password: '123456',
  };

  return await User.new(userPayload);
}
