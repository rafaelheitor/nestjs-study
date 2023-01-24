import { Exception } from 'src/Core/common/exception/Exception';
import { User } from 'src/Core/Domain/user/entity/user.entity';
import { UserRepositoryPort } from 'src/Core/Domain/user/port/persistence/userRepositoryPort';
import { CreateUserPort } from 'src/Core/Domain/user/port/useCase/CreateUserPort';
import { CreateUserUseCase } from 'src/Core/Domain/user/usecase/CreateUserUsecase';
import { UserUsecaseDto } from 'src/Core/Domain/user/usecase/dto/UserUsecaseDto';
import { Code } from 'src/Core/common/code/Code';
import { CoreAssert } from 'src/core/common/util/assert/CoreAssert';

export class CreateUserService implements CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  public async execute(port?: CreateUserPort): Promise<UserUsecaseDto> {
    const user: User = await User.new({
      name: port.name,
      password: port.password,
      email: port.email,
    });

    const alreadyUser: User = await this.userRepository.getByEmail(port.email);

    CoreAssert.notEmpty(
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
