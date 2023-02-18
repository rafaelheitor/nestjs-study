import { UseCase } from 'src/Core/common/usecase/Usecase';
import { OrderUseCaseDto } from './dto/OrderUseCaseDto';

export interface GetAllOrders extends UseCase<null, OrderUseCaseDto[]> {}
