import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { GetProducPort } from '@core/domain/product/port/usecase/GetProductPort';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { GetProductUseCase } from '@core/domain/product/usecase/GetProductUseCase';

export class GetProductService implements GetProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(port?: GetProducPort): Promise<ProductUseCaseDto> {
    const foundProduct: Product = CoreAssert.notEmpty(
      await this.productRepository.getProduct(port.productId),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Product not found',
      }),
    );
    return ProductUseCaseDto.newFromProduct(foundProduct);
  }
}
