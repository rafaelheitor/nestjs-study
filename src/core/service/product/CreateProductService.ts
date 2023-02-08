import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { CreateProductPort } from '@core/domain/product/port/usecase/CreateProductPort';
import { CreateProductUseCase } from '@core/domain/product/usecase/CreateProductUseCase';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';

export class CreateProductService implements CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(port?: CreateProductPort): Promise<ProductUseCaseDto> {
    const product: Product = await Product.new({
      name: port.name,
      image: port.image,
      price: port.price,
      quantity: port.quantity,
    });
    await this.productRepository.saveProduct(product);
    return ProductUseCaseDto.newFromProduct(product);
  }
}
