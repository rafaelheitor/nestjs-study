import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';
import { UserUsecaseDto } from '@core/domain/user/usecase/dto/UserUsecaseDto';
import { GetUserListUseCase } from '@core/domain/user/usecase/GetUserListUseCase';

export class GetUserListService implements GetUserListUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<UserUsecaseDto[]> {
    const userList: User[] = await this.userRepository.getAll();
    return UserUsecaseDto.newListFromUser(userList);
  }
}
