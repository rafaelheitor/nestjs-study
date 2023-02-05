import { UseCase } from 'src/Core/common/usecase/Usecase';
import { DeleteProductPort } from '../port/usecase/DeleteProductPort';
import { ProductUseCaseDto } from './dto/ProductUseCaseDto';

export interface DeleteProductUseCase
  extends UseCase<DeleteProductPort, ProductUseCaseDto> {}
