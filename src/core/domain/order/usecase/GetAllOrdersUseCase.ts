import { UseCase } from 'src/Core/common/usecase/Usecase';
import { OrderUseCaseDto } from './dto/OrderUseCaseDto';

export interface GetAllOrdersUseCase extends UseCase<null, OrderUseCaseDto[]> {}
