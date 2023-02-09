import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { CreateProductUseCase } from '@core/domain/product/usecase/CreateProductUseCase';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { EditProductUseCase } from '@core/domain/product/usecase/EditProductUseCase';
import { GetProductUseCase } from '@core/domain/product/usecase/GetProductUseCase';
import { CreateProductAdapter } from '@infrastructure/adapter/usecase/product/CreateProductAdapter';
import { EditProductAdapter } from '@infrastructure/adapter/usecase/product/EditProductAdapter';
import { GetProductAdapter } from '@infrastructure/adapter/usecase/product/GetProductAdapter';
import { Body, Controller, Get, Inject, Patch, Post } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductDITokens.CreateProductUseCase)
    private readonly createProductUseCase: CreateProductUseCase,

    @Inject(ProductDITokens.EditProductUseCase)
    private readonly editProductUseCase: EditProductUseCase,

    @Inject(ProductDITokens.GetProductUseCase)
    private readonly getProductUseCase: GetProductUseCase,
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

  @Patch('edit')
  public async edit(@Body() body) {
    const adapter: EditProductAdapter = await EditProductAdapter.new({
      productId: body.productId,
      name: body.name,
      image: body.image,
      price: body.price,
      quantity: body.quantity,
    });

    const editedProduct: ProductUseCaseDto =
      await this.editProductUseCase.execute(adapter);

    return CoreApiResponse.success(editedProduct, 'Product edited successfuly');
  }

  @Get('product')
  public async getProduct(@Body() body) {
    const adapter: GetProductAdapter = await GetProductAdapter.new({
      productId: body.productId,
    });

    const product = await this.getProductUseCase.execute(adapter);

    return CoreApiResponse.success(product, 'Product Found');
  }
}
