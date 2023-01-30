import { UseCase } from 'src/Core/common/usecase/Usecase';
import { EditUserPort } from '../port/useCase/EditUserPort';
import { EditUserUseCaseDto } from './dto/EditUserUseCaseDto';

export interface EditUserUseCase
  extends UseCase<EditUserPort, EditUserUseCaseDto> {}
