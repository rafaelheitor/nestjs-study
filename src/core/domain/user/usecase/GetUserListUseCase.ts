import { UseCase } from 'src/Core/common/usecase/Usecase';
import { UserUsecaseDto } from './dto/UserUsecaseDto';

export interface GetUserListUseCase extends UseCase<null, UserUsecaseDto[]> {}
