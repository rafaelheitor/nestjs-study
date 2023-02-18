import { UseCase } from 'src/Core/common/usecase/Usecase';
import { EditOrderStatusPort } from '../port/usecase/EditOrderStautsPort';
import { OrderUseCaseDto } from './dto/OrderUseCaseDto';

export interface EditOrderStatusUseCase
  extends UseCase<EditOrderStatusPort, OrderUseCaseDto> {}
