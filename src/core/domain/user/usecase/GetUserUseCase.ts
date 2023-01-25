import { UseCase } from 'src/Core/common/usecase/Usecase';
import { UserUsecaseDto } from './dto/UserUsecaseDto';
import { GetUserPort } from '../port/useCase/GetUserPort';

export interface GetUserUseCase extends UseCase<GetUserPort, UserUsecaseDto> {}
