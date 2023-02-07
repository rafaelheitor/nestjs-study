import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { EditProducPort } from '@core/domain/product/port/usecase/EditProductPort';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { EditProductUseCase } from '@core/domain/product/usecase/EditProductUseCase';

export class EditProductService implements EditProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(port?: EditProducPort): Promise<ProductUseCaseDto> {
    const foundProduct: Product = CoreAssert.notEmpty(
      await this.productRepository.getProduct(port.productId),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Product not found',
      }),
    );

    await foundProduct.edit({
      name: port.name,
      image: port.image,
      price: port.price,
      quantity: port.quantity,
    });

    this.productRepository.editProduct(port.productId, {
      name: foundProduct.getName(),
      image: foundProduct.getImage(),
      price: foundProduct.getPrice(),
      quantity: foundProduct.getQuantity(),
    });

    return ProductUseCaseDto.newFromProduct(foundProduct);
  }
}
