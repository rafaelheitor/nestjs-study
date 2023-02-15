import { UseCase } from '@core/common/usecase/Usecase';
import { ProductUseCaseDto } from './dto/ProductUseCaseDto';

export interface GetProductListUseCase
  extends UseCase<null, ProductUseCaseDto[]> {}
