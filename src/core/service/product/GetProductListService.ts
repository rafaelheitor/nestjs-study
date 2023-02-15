import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { GetProductListUseCase } from '@core/domain/product/usecase/GetProductListUseCase';

export class GetProductListService implements GetProductListUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(): Promise<ProductUseCaseDto[]> {
    const products: Product[] = await this.productRepository.getAllProducts();
    return ProductUseCaseDto.newListFromProduct(products);
  }
}
