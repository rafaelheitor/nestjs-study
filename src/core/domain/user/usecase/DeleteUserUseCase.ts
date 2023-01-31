import { UseCase } from 'src/Core/common/usecase/Usecase';
import { DeleteUserPort } from '../port/useCase/DeleteUserPort';
import { DeleteUserUseCaseDto } from './dto/DeleteUserUseCaseDto';

export interface DeleteUserUseCase
  extends UseCase<DeleteUserPort, DeleteUserUseCaseDto> {}
