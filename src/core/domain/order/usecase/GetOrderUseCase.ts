import { UseCase } from 'src/Core/common/usecase/Usecase';
import { GetOrderPort } from '../port/usecase/GetOrderPort';
import { OrderUseCaseDto } from './dto/OrderUseCaseDto';

export interface GetOrderUseCase
  extends UseCase<GetOrderPort, OrderUseCaseDto> {}
