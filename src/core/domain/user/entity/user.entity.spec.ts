import { User } from './user.entity';

describe('Tests user entity', () => {
  it('Should create a new user object', async () => {
    const user = await User.new({
      name: 'Rafael',
      email: 'rafael@email.com',
      password: '123456',
    });
    expect(user.password).toEqual('123456');
  });
});
