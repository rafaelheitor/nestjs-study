import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { User } from '@core/Domain/user/entity/User';
import { UserRepositoryPort } from '@core/Domain/user/port/persistence/userRepositoryPort';
import { GetUserPort } from '@core/domain/user/port/useCase/GetUserPort';
import { UserUsecaseDto } from '@core/Domain/user/usecase/dto/UserUsecaseDto';
import { GetUserUseCase } from '@core/domain/user/usecase/getUserUseCase';

export class GetUserService implements GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(port?: GetUserPort): Promise<UserUsecaseDto> {
    const user: User = await this.userRepository.getByEmail(port.email);

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
