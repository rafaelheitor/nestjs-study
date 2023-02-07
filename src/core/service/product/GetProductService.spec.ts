import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { GetProducPort } from '@core/domain/product/port/usecase/GetProductPort';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { GetProductUseCase } from '@core/domain/product/usecase/GetProductUseCase';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@core/domain/product/entity/Product';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';
import { v4 } from 'uuid';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { GetProductService } from './GetProductService';

describe('GetProductService', () => {
  let getProductsUseCase: GetProductUseCase;
  let productRepository: ProductRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ProductRepository',
          useClass: ProductRepositoryInMemory,
        },
        {
          provide: 'GetProductUseCase',
          useFactory: (productRepository) =>
            new GetProductService(productRepository),
          inject: ['ProductRepository'],
        },
      ],
    }).compile();
    getProductsUseCase = module.get<GetProductUseCase>('GetProductUseCase');
    productRepository = module.get<ProductRepositoryPort>('ProductRepository');
  });

  test('Should find product in repository', async () => {
    const productPort: GetProducPort = {
      productId: v4(),
    };
    const expectedProduct: Product = await Product.new({
      id: productPort.productId,
      name: 'Product Name',
      image: 'product image',
      price: 50,
      quantity: 10,
    });

    jest.spyOn(productRepository, 'getProduct').mockImplementation(async () => {
      return expectedProduct;
    });

    const expectedProductDto: ProductUseCaseDto =
      ProductUseCaseDto.newFromProduct(expectedProduct);
    const resultProductDto: ProductUseCaseDto =
      await getProductsUseCase.execute(productPort);

    expect(expectedProductDto).toStrictEqual(resultProductDto);
  });

  test('Should throw exception if product was not found', async () => {
    const productPort: GetProducPort = {
      productId: v4(),
    };

    jest.spyOn(productRepository, 'getProduct').mockImplementation(async () => {
      return undefined;
    });

    expect.hasAssertions();

    try {
      await getProductsUseCase.execute(productPort);
    } catch (error) {
      const exception: Exception<ClassValidationDetails> =
        error as Exception<ClassValidationDetails>;
      expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      expect(exception).toBeInstanceOf(Exception);
    }
  });
});
