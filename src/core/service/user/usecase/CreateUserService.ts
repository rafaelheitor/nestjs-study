import { Exception } from '../../../common/exception/Exception';
import { User } from '../../../domain/user/entity/User';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/userRepositoryPort';
import { CreateUserPort } from '../../../domain/user/port/useCase/CreateUserPort';
import { CreateUserUseCase } from '../../../domain/user/usecase/CreateUserUsecase';
import { UserUsecaseDto } from '../../../domain/user/usecase/dto/UserUsecaseDto';
import { Code } from '../../../common/code/Code';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';

export class CreateUserService implements CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  public async execute(port?: CreateUserPort): Promise<UserUsecaseDto> {
    const user: User = await User.new({
      id: port.id,
      name: port.name,
      password: port.password,
      email: port.email,
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
