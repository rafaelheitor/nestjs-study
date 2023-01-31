import { Code } from '../../../common/code/Code';
import { Exception } from '../../../common/exception/Exception';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';
import { User } from '../../../domain/user/entity/User';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/userRepositoryPort';
import { DeleteUserPort } from '../../../domain/user/port/useCase/DeleteUserPort';
import { DeleteUserUseCase } from '../../../domain/user/usecase/DeleteUserUseCase';
import { DeleteUserUseCaseDto } from '../../../domain/user/usecase/dto/DeleteUserUseCaseDto';

export class DeleteUserService implements DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(port?: DeleteUserPort): Promise<DeleteUserUseCaseDto> {
    const foundUser: User = await this.userRepository.getByEmail(port.email);

    CoreAssert.isFalse(
      !foundUser,
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `User with email ${port.email} was not found`,
      }),
    );

    await foundUser.remove();
    this.userRepository.delete(foundUser.getEmail());
    return DeleteUserUseCaseDto.newFromUser(foundUser);
  }
}
