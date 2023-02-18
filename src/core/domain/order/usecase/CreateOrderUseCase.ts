import { UseCase } from 'src/Core/common/usecase/Usecase';
import { CreateOrderPort } from '../port/usecase/CreateOrderPort';
import { OrderUseCaseDto } from './dto/OrderUseCaseDto';

export interface CreateOrderUseCase
  extends UseCase<CreateOrderPort, OrderUseCaseDto> {}
