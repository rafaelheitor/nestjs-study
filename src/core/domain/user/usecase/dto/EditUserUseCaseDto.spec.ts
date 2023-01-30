import { User } from '../../entity/User';
import { EditUserUseCaseDto } from './EditUserUseCaseDto';
describe('Edit UserUseCaseDto', () => {
  const customCreated = new Date(Date.now() - 50000);
  const customEdited = new Date();

  const expectedDto = {
    name: 'Teste',
    email: 'email@email.com',
    password: '123456',
    createdAt: customCreated,
    editedAt: customEdited,
  };
  test('Should create a new user dto with editedAt parameter', async () => {
    const editedUser: User = await User.new({
      name: expectedDto.name,
      email: expectedDto.email,
      password: expectedDto.password,
      createdAt: expectedDto.createdAt,
      editedAt: expectedDto.editedAt,
    });

    const editUserUsecaseDto: EditUserUseCaseDto =
      EditUserUseCaseDto.newFromUser(editedUser);

    expect(editUserUsecaseDto.name).toEqual(editedUser.getName());
    expect(editUserUsecaseDto.email).toEqual(editedUser.getEmail());
    expect(editUserUsecaseDto.createdAt).toEqual(editedUser.getCreatedAt());
    expect(editUserUsecaseDto.editedAt).toEqual(editedUser.getEditedAt());
  });
});
