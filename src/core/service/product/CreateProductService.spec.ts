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
          provide: 'ProductRepository',
          useClass: ProductRepositoryInMemory,
        },
        {
          provide: 'CreateProductUseCase',
          useFactory: (productRepository) =>
            new CreateProductService(productRepository),
          inject: ['ProductRepository'],
        },
      ],
    }).compile();

    createProductUseCase = module.get<CreateProductUseCase>(
      'CreateProductUseCase',
    );
    productRepository = module.get<ProductRepositoryPort>('ProductRepository');
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

    jest
      .spyOn(productRepository, 'saveProduct')
      .mockImplementation(async () => {
        return expectedProduct;
      });

    const expectedProductDto: ProductUseCaseDto =
      ProductUseCaseDto.newFromProduct(expectedProduct);

    const resultProductDto: ProductUseCaseDto =
      await createProductUseCase.execute(productPort);

    Reflect.set(
      expectedProductDto,
      'createdAt',
      expectedProduct.getCreatedAt(),
    );
    Reflect.set(resultProductDto, 'createdAt', expectedProduct.getCreatedAt());

    expect(expectedProductDto).toStrictEqual(resultProductDto);
  });
});
