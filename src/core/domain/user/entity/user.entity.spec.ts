import { User } from './user.entity';

describe('Tests user entity', () => {
  it('Should create a new user object', () => {
    const user = User.new({
      name: 'Rafael',
      email: 'rafael@email.com',
      password: '123456',
    });
  });
});
