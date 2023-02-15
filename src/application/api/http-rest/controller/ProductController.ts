import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { UserRoles } from '@core/common/enums/UserEnums';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { CreateProductUseCase } from '@core/domain/product/usecase/CreateProductUseCase';
import { DeleteProductUseCase } from '@core/domain/product/usecase/DeleteProductUseCase';
import { DeleteProductUseCaseDto } from '@core/domain/product/usecase/dto/DeleteProductUseCaseDto';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { EditProductUseCase } from '@core/domain/product/usecase/EditProductUseCase';
import { GetProductListUseCase } from '@core/domain/product/usecase/GetProductListUseCase';
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
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpAuth } from '../auth/decorator/HttpAuth';
import { HttpRestApiEditProductBody } from './documentation/product/HttpRestApiEditProductBody';
import { HttpRestApiModelCreateProductBody } from './documentation/product/HttpRestApiModelCreateProductBody';
import { HttpRestApiModelProductDeleted } from './documentation/product/HttpRestApiModelProductDeleted';
import { HttpRestApiResponseProduct } from './documentation/product/HttpRestApiResponseProduct';
import { HttpRestApiResponseProductList } from './documentation/product/HttpRestApiResponseProductList';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductDITokens.CreateProductUseCase)
    private readonly createProductUseCase: CreateProductUseCase,

    @Inject(ProductDITokens.EditProductUseCase)
    private readonly editProductUseCase: EditProductUseCase,

    @Inject(ProductDITokens.GetProductUseCase)
    private readonly getProductUseCase: GetProductUseCase,

    @Inject(ProductDITokens.GetProductListUseCase)
    private readonly getProductListUseCase: GetProductListUseCase,

    @Inject(ProductDITokens.DeleteProductUseCase)
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @ApiBasicAuth()
  @HttpAuth(UserRoles.ADMIN)
  @Post('new')
  @ApiBody({ type: HttpRestApiModelCreateProductBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseProduct })
  public async createProduct(
    @Body() body: HttpRestApiModelCreateProductBody,
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

  @ApiBasicAuth()
  @HttpAuth(UserRoles.ADMIN)
  @Patch('edit/:productId')
  @ApiBody({ type: HttpRestApiEditProductBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseProduct })
  public async edit(
    @Param('productId') productId: string,
    @Body() body: HttpRestApiEditProductBody,
  ): Promise<CoreApiResponse<ProductUseCaseDto>> {
    const adapter: EditProductAdapter = await EditProductAdapter.new({
      productId: productId,
      name: body.name,
      image: body.image,
      price: body.price,
      quantity: body.quantity,
    });

    const editedProduct: ProductUseCaseDto =
      await this.editProductUseCase.execute(adapter);

    return CoreApiResponse.success(editedProduct, 'Product edited successfuly');
  }

  @Get('list')
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseProductList })
  public async getProductList(): Promise<CoreApiResponse<ProductUseCaseDto[]>> {
    const products: ProductUseCaseDto[] =
      await this.getProductListUseCase.execute();
    return CoreApiResponse.success(products, 'Product List');
  }

  @Get(':productId')
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseProduct })
  public async getProduct(
    @Param('productId') productId: string,
  ): Promise<CoreApiResponse<ProductUseCaseDto>> {
    const adapter: GetProductAdapter = await GetProductAdapter.new({
      productId: productId,
    });

    const product = await this.getProductUseCase.execute(adapter);

    return CoreApiResponse.success(product, 'Product Found');
  }

  @ApiBasicAuth()
  @HttpAuth(UserRoles.ADMIN)
  @Delete('/delete/:productId')
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiModelProductDeleted })
  public async deleteProduct(
    @Param('productId') productId: string,
  ): Promise<CoreApiResponse<DeleteProductUseCaseDto>> {
    const adapter: DeleteProductAdapter = await DeleteProductAdapter.new({
      productId: productId,
    });
    const deletedProduct: DeleteProductUseCaseDto =
      await this.deleteProductUseCase.execute(adapter);

    return CoreApiResponse.success(deletedProduct);
  }
}
