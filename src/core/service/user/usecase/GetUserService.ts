import { Code } from 'src/Core/common/code/Code';
import { Exception } from 'src/Core/common/exception/Exception';
import { CoreAssert } from 'src/core/common/util/assert/CoreAssert';
import { User } from 'src/Core/Domain/user/entity/user.entity';
import { UserRepositoryPort } from 'src/Core/Domain/user/port/persistence/userRepositoryPort';
import { GetUserPort } from 'src/core/domain/user/port/useCase/GetUserPort';
import { UserUsecaseDto } from 'src/Core/Domain/user/usecase/dto/UserUsecaseDto';
import { GetUserUseCase } from 'src/core/domain/user/usecase/getUserUseCase';

export class GetUserService implements GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(port?: GetUserPort): Promise<UserUsecaseDto> {
    const user: User = await this.userRepository.getByEmail(port.email);
    // console.log(user);

    CoreAssert.notEmpty(
      user,
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `User with email ${port.email} was not found `,
      }),
    );
    const userFound: UserUsecaseDto = UserUsecaseDto.newFromUser(user);

    return userFound;
  }
}
