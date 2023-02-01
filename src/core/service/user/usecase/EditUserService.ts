import { Code } from '../../../common/code/Code';
import { Exception } from '../../../common/exception/Exception';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';
import { User } from '../../../domain/user/entity/User';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/userRepositoryPort';
import { EditUserPort } from '../../../domain/user/port/useCase/EditUserPort';
import { EditUserUseCase } from '../../../domain/user/usecase/EditUserUseCase';
import { EditUserUseCaseDto } from '../../../domain/user/usecase/dto/EditUserUseCaseDto';

export class EditUserService implements EditUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(port?: EditUserPort): Promise<EditUserUseCaseDto> {
    const foundUser: User = await this.userRepository.getByEmail(port.email);

    CoreAssert.isFalse(
      !foundUser,
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `User ${port.email} was not found`,
      }),
    );

    await foundUser.edit({
      name: port.name,
      password: port.password,
    });
    await this.userRepository.edit(foundUser);

    const editedUser: EditUserUseCaseDto =
      EditUserUseCaseDto.newFromUser(foundUser);
    return editedUser;
  }
}