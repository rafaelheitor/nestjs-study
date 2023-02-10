import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { CreateProductPort } from '@core/domain/product/port/usecase/CreateProductPort';
import { CreateProductUseCase } from '@core/domain/product/usecase/CreateProductUseCase';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { CreateProductService } from './CreateProductService';

describe('CreateProductService', () => {
  let createProductUseCase: CreateProductUseCase;
  let productRepository: ProductRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductDITokens.ProductRepository,
          useClass: ProductRepositoryInMemory,
        },
        {
          provide: ProductDITokens.CreateProductUseCase,
          useFactory: (productRepository) =>
            new CreateProductService(productRepository),
          inject: [ProductDITokens.ProductRepository],
        },
      ],
    }).compile();

    createProductUseCase = module.get<CreateProductUseCase>(
      ProductDITokens.CreateProductUseCase,
    );
    productRepository = module.get<ProductRepositoryPort>(
      ProductDITokens.ProductRepository,
    );
  });

  test('Should create a new product and save it', async () => {
    const productPort: CreateProductPort = {
      id: v4(),
      name: 'Product Name',
      image: 'product image',
      price: 50,
      quantity: 10,
    };
    const expectedProduct: Product = await Product.new({
      id: productPort.id,
      name: productPort.name,
      image: productPort.image,
      price: productPort.price,
      quantity: productPort.quantity,
    });

    console.log(productPort.id === expectedProduct.getId());
    jest
      .spyOn(productRepository, 'saveProduct')
      .mockImplementation(async () => {
        return expectedProduct;
      });

    const expectedProductDto: ProductUseCaseDto =
      ProductUseCaseDto.newFromProduct(expectedProduct);

    const resultProductDto: ProductUseCaseDto =
      await createProductUseCase.execute(productPort);

    const resultAddedProduct: Product = jest.spyOn(
      productRepository,
      'saveProduct',
    ).mock.calls[0][0];

    Reflect.set(
      expectedProductDto,
      'createdAt',
      expectedProduct.getCreatedAt(),
    );
    Reflect.set(expectedProductDto, 'id', expectedProduct.getId());

    Reflect.set(resultProductDto, 'createdAt', expectedProduct.getCreatedAt());
    Reflect.set(resultProductDto, 'id', expectedProduct.getId());

    Reflect.set(
      resultAddedProduct,
      'createdAt',
      expectedProduct.getCreatedAt(),
    );
    Reflect.set(resultAddedProduct, 'id', expectedProduct.getId());

    expect(expectedProductDto).toStrictEqual(resultProductDto);
    expect(expectedProduct).toStrictEqual(resultAddedProduct);
  });
});
