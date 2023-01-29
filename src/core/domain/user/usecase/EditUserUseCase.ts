import { UseCase } from 'src/Core/common/usecase/Usecase';
import { EditUserPort } from '../port/useCase/EditUserPort';
import { UserUsecaseDto } from './dto/UserUsecaseDto';

export interface EditUserUseCase
  extends UseCase<EditUserPort, UserUsecaseDto> {}
