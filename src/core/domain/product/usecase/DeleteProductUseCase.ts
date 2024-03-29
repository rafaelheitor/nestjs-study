import { UseCase } from 'src/Core/common/usecase/Usecase';
import { DeleteProductPort } from '../port/usecase/DeleteProductPort';
import { DeleteProductUseCaseDto } from './dto/DeleteProductUseCaseDto';

export interface DeleteProductUseCase
  extends UseCase<DeleteProductPort, DeleteProductUseCaseDto> {}
