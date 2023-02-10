import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { DeleteProductPort } from '@core/domain/product/port/usecase/DeleteProductPort';
import { DeleteProductUseCase } from '@core/domain/product/usecase/DeleteProductUseCase';
import { DeleteProductUseCaseDto } from '@core/domain/product/usecase/dto/DeleteProductUseCaseDto';

export class DeleteProductService implements DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(port?: DeleteProductPort): Promise<DeleteProductUseCaseDto> {
    const foundProduct: Product = CoreAssert.notEmpty(
      await this.productRepository.getProduct(port.productId),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Product not found',
      }),
    );
    await foundProduct.remove();
    await this.productRepository.delete(port.productId);
    return DeleteProductUseCaseDto.newFromProduct(foundProduct);
  }
}
