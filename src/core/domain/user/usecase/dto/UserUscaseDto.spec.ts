import { createUserPayload, User } from '../../entity/user.entity';
import { UserUsecaseDto } from './UserUsecaseDto';

describe('Tests the UserUsecaseDto', () => {
  it('should create a new user dto', () => {
    const user = createUser();
    const userDto: UserUsecaseDto = UserUsecaseDto.newFromUser(user);

    expect(user !== userDto).toBeTruthy();
  });

  it('Should Create a list from User dto', () => {
    const user: User = createUser();
    const user2: User = createUser();
    const user3: User = createUser();
    const user4: User = createUser();
    const users = [{ ...user }, { ...user2 }, { ...user3 }, { ...user4 }];

    const listFromDto: UserUsecaseDto[] = UserUsecaseDto.newListFromUser(users);
    expect(listFromDto[0] instanceof UserUsecaseDto).toBeTruthy();
  });
});

function createUser(id?: string) {
  const userPayload: createUserPayload = {
    name: 'Rafael',
    email: 'rafael@email.com',
    password: '123456',
  };

  return User.new(userPayload);
}
