import { UseCase } from 'src/Core/common/usecase/Usecase';
import { CreateUserPort } from '../port/useCase/CreateUserPort';
import { UserUsecaseDto } from './dto/UserUsecaseDto';

export type CreateUserUseCase = UseCase<CreateUserPort, UserUsecaseDto>;
