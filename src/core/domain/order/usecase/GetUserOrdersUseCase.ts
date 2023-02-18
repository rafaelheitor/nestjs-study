import { UseCase } from 'src/Core/common/usecase/Usecase';
import { GetUserOrdersPort } from '../port/usecase/GetUserOrdersPort';
import { OrderUseCaseDto } from './dto/OrderUseCaseDto';

export interface GetUserOrdersUseCase
  extends UseCase<GetUserOrdersPort, OrderUseCaseDto[]> {}
