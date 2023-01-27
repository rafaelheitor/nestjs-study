import { User } from './User';

describe('Tests user entity', () => {
  it('Should create a new user object', async () => {
    const user = await User.new({
      name: 'Rafael',
      email: 'rafael@email.com',
      password: '123456',
    });
  });
});
