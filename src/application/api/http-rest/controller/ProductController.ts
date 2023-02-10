import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { UserRoles } from '@core/common/enums/UserEnums';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { CreateProductUseCase } from '@core/domain/product/usecase/CreateProductUseCase';
import { DeleteProductUseCase } from '@core/domain/product/usecase/DeleteProductUseCase';
import { DeleteProductUseCaseDto } from '@core/domain/product/usecase/dto/DeleteProductUseCaseDto';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { EditProductUseCase } from '@core/domain/product/usecase/EditProductUseCase';
import { GetProductUseCase } from '@core/domain/product/usecase/GetProductUseCase';
import { CreateProductAdapter } from '@infrastructure/adapter/usecase/product/CreateProductAdapter';
import { DeleteProductAdapter } from '@infrastructure/adapter/usecase/product/DeleteProductAdapter';
import { EditProductAdapter } from '@infrastructure/adapter/usecase/product/EditProductAdapter';
import { GetProductAdapter } from '@infrastructure/adapter/usecase/product/GetProductAdapter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HttpAuth } from '../auth/decorator/HttpAuth';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductDITokens.CreateProductUseCase)
    private readonly createProductUseCase: CreateProductUseCase,

    @Inject(ProductDITokens.EditProductUseCase)
    private readonly editProductUseCase: EditProductUseCase,

    @Inject(ProductDITokens.GetProductUseCase)
    private readonly getProductUseCase: GetProductUseCase,

    @Inject(ProductDITokens.DeleteProductUseCase)
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @HttpAuth(UserRoles.ADMIN)
  @Post('new')
  public async createProduct(
    @Body() body,
  ): Promise<CoreApiResponse<ProductUseCaseDto>> {
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

  @HttpAuth(UserRoles.ADMIN)
  @Patch('edit')
  public async edit(@Body() body): Promise<CoreApiResponse<ProductUseCaseDto>> {
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
  public async getProduct(
    @Body() body,
  ): Promise<CoreApiResponse<ProductUseCaseDto>> {
    const adapter: GetProductAdapter = await GetProductAdapter.new({
      productId: body.productId,
    });

    const product = await this.getProductUseCase.execute(adapter);

    return CoreApiResponse.success(product, 'Product Found');
  }

  @HttpAuth(UserRoles.ADMIN)
  @Delete('/delete/:productId')
  public async deleteProduct(
    @Param() param,
  ): Promise<CoreApiResponse<DeleteProductUseCaseDto>> {
    const adapter: DeleteProductAdapter = await DeleteProductAdapter.new({
      productId: param.productId,
    });
    const deletedProduct: DeleteProductUseCaseDto =
      await this.deleteProductUseCase.execute(adapter);

    return CoreApiResponse.success(deletedProduct);
  }
}
