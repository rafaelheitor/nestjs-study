import { UseCase } from 'src/Core/common/usecase/Usecase';
import { GetProducPort } from '../port/usecase/GetProductPort';
import { ProductUseCaseDto } from './dto/ProductUseCaseDto';

export interface GetProductUseCase
  extends UseCase<GetProducPort, ProductUseCaseDto> {}
