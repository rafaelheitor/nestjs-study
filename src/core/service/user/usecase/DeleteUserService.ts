import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { DeleteUserPort } from '@core/domain/user/port/useCase/DeleteUserPort';
import { DeleteUserUseCase } from '@core/domain/user/usecase/DeleteUserUseCase';
import { DeleteUserUseCaseDto } from '@core/domain/user/usecase/dto/DeleteUserUseCaseDto';

export class DeleteUserService implements DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(port?: DeleteUserPort): Promise<DeleteUserUseCaseDto> {
    const foundUser: User = await this.userRepository.getById(port.id);

    CoreAssert.isFalse(
      !foundUser,
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `User ${port.id} was not found`,
      }),
    );

    await foundUser.remove();
    this.userRepository.delete(foundUser.getEmail());
    const deletedUser = DeleteUserUseCaseDto.newFromUser(foundUser);
    return deletedUser;
  }
}
