import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { EditUserPort } from '@core/domain/user/port/useCase/EditUserPort';
import { EditUserUseCase } from '@core/domain/user/usecase/EditUserUseCase';
import { EditUserUseCaseDto } from '@core/domain/user/usecase/dto/EditUserUseCaseDto';

export class EditUserService implements EditUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(port?: EditUserPort): Promise<EditUserUseCaseDto> {
    const foundUser: User = await this.userRepository.getById(port.id);

    CoreAssert.isFalse(
      !foundUser,
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `User ${port.id} was not found`,
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
