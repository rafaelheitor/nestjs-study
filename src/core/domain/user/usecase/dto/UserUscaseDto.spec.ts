import { createUserPayload, User } from '../../entity/user.entity';
import { UserUsecaseDto } from './UserUsecaseDto';

describe('Tests the UserUsecaseDto', () => {
  it('should create a new user dto', async () => {
    const user = await createUser();
    const userDto: UserUsecaseDto = UserUsecaseDto.newFromUser(user);

    expect(user !== userDto).toBeTruthy();
  });

  it('Should Create a list from User dto', async () => {
    const user: User = await createUser();
    const user2: User = await createUser();
    const user3: User = await createUser();
    const user4: User = await createUser();
    const users = [{ ...user }, { ...user2 }, { ...user3 }, { ...user4 }];

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
