import { v4 } from 'uuid';
import { createUserPayload, User } from './User';

describe('Tests user entity', () => {
  const expectedUser: createUserPayload = {
    name: 'Rafael',
    email: 'rafael@email.com',
    password: '123456',
  };
  describe('new', () => {
    it('Should create a new user object with required parameters', async () => {
      const user = await User.new({
        name: expectedUser.name,
        email: expectedUser.email,
        password: expectedUser.password,
      });

      expect(user.getName()).toBe(expectedUser.name);
      expect(user.getEmail()).toBe(expectedUser.email);
      expect(user.getPassword() == expectedUser.password).toBeFalsy();
    });

    it('Should create a new user object with optional parameters', async () => {
      const id = v4();
      const customCreatedAt = new Date(Date.now() - 50000);
      const customRemovedAt = new Date();

      const customUser: createUserPayload = {
        id: id,
        name: expectedUser.name,
        email: expectedUser.email,
        password: expectedUser.password,
        createdAt: customCreatedAt,
        removedAt: customRemovedAt,
      };
      const user: User = await User.new(customUser);

      expect(user.getId()).toBe(customUser.id);
      expect(user.getCreatedAt()).toBe(customUser.createdAt);
    });
  });

  describe('edit', () => {
    it('Should edit a user when paramaters are set', async () => {
      const currentDate: number = Date.now();

      const user: User = await User.new(expectedUser);

      await user.edit({
        name: 'João',
      });

      await user.edit({
        password: '654321',
      });

      expect(user.getName()).toBe('João');
      expect(user.getEditedAt()!.getTime()).toBeGreaterThanOrEqual(
        currentDate - 5000,
      );
      expect(user.comparePassword('654321')).resolves.toBeTruthy();
    });
  });

  describe('remove', () => {
    it('Should mark User instance as removed', async () => {
      const currentDate: number = Date.now();
      const customUser: User = await User.new({
        name: expectedUser.name,
        email: expectedUser.email,
        password: expectedUser.password,
      });

      await customUser.remove();

      expect(customUser.getRemovedAt()!.getTime()).toBeGreaterThanOrEqual(
        currentDate - 5000,
      );
    });
  });
});
