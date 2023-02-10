import { ProductController } from '@application/api/http-rest/controller/ProductController';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { CreateProductService } from '@core/service/product/CreateProductService';
import { DeleteProductService } from '@core/service/product/DeleteProductService';
import { EditProductService } from '@core/service/product/EditProductService';
import { GetProductService } from '@core/service/product/GetProductService';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { Module, Provider } from '@nestjs/common';

const useCaseProviders: Provider[] = [
  {
    provide: ProductDITokens.CreateProductUseCase,
    useFactory: (productRepository) =>
      new CreateProductService(productRepository),
    inject: [ProductDITokens.ProductRepository],
  },
  {
    provide: ProductDITokens.EditProductUseCase,
    useFactory: (productRepository) =>
      new EditProductService(productRepository),
    inject: [ProductDITokens.ProductRepository],
  },
  {
    provide: ProductDITokens.GetProductUseCase,
    useFactory: (productRepository) => new GetProductService(productRepository),
    inject: [ProductDITokens.ProductRepository],
  },
  {
    provide: ProductDITokens.DeleteProductUseCase,
    useFactory: (productRepository) =>
      new DeleteProductService(productRepository),
    inject: [ProductDITokens.ProductRepository],
  },
];

const persistenceProviders: Provider[] = [
  {
    provide: ProductDITokens.ProductRepository,
    useClass: ProductRepositoryInMemory,
  },
];

@Module({
  providers: [...persistenceProviders, ...useCaseProviders],
  controllers: [ProductController],
})
export class ProductModule {}
