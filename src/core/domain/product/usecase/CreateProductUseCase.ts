import { UseCase } from 'src/Core/common/usecase/Usecase';
import { CreateProductPort } from '../port/usecase/CreateProductPort';
import { ProductUseCaseDto } from './dto/ProductUseCaseDto';

export interface CreateProductUseCase
  extends UseCase<CreateProductPort, ProductUseCaseDto> {}
