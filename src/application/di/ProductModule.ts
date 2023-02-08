import { ProductController } from '@application/api/http-rest/controller/ProductController';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { CreateProductService } from '@core/service/product/CreateProductService';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { Module, Provider } from '@nestjs/common';

const useCaseProviders: Provider[] = [
  {
    provide: ProductDITokens.CreateProductUseCase,
    useFactory: (productRepository) =>
      new CreateProductService(productRepository),
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
