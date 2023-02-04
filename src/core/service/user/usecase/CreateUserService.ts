import { Exception } from '@core/common/exception/Exception';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { CreateUserPort } from '@core/domain/user/port/useCase/CreateUserPort';
import { CreateUserUseCase } from '@core/domain/user/usecase/CreateUserUsecase';
import { UserUsecaseDto } from '@core/domain/user/usecase/dto/UserUsecaseDto';
import { Code } from '@core/common/code/Code';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { UserRoles } from '@core/common/enums/UserEnums';

export class CreateUserService implements CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  public async execute(port?: CreateUserPort): Promise<UserUsecaseDto> {
    const user: User = await User.new({
      id: port.id,
      name: port.name,
      password: port.password,
      email: port.email,
      role: port.role,
    });

    const alreadyUser = !!(await this.userRepository.getByEmail(port.email));

    CoreAssert.isFalse(
      alreadyUser,
      Exception.new({
        code: Code.ENTITY_ALREADY_EXISTS_ERROR,
        overrideMessage: 'User already exists',
      }),
    );

    await this.userRepository.save(user);
    return UserUsecaseDto.newFromUser(user);
  }
}
