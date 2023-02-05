import { UseCase } from 'src/Core/common/usecase/Usecase';
import { EditProducPort } from '../port/usecase/EditProductPort';
import { ProductUseCaseDto } from './dto/ProductUseCaseDto';

export interface EditProductUseCase
  extends UseCase<EditProducPort, ProductUseCaseDto> {}
