import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { CreateProductUseCase } from '@core/domain/product/usecase/CreateProductUseCase';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { CreateProductAdapter } from '@infrastructure/adapter/usecase/product/CreateProductAdapter';
import { Body, Controller, Inject, Post } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductDITokens.CreateProductUseCase)
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post('new')
  public async createProduct(@Body() body) {
    const adapter: CreateProductAdapter = await CreateProductAdapter.new({
      name: body.name,
      image: body.image,
      price: body.price,
      quantity: body.quantity,
    });

    const createdProduct: ProductUseCaseDto =
      await this.createProductUseCase.execute(adapter);

    return CoreApiResponse.success(createdProduct, 'Product created');
  }
}
