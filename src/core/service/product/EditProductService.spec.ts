import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { EditProducPort } from '@core/domain/product/port/usecase/EditProductPort';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { EditProductUseCase } from '@core/domain/product/usecase/EditProductUseCase';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { EditProductService } from './EditProductService';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('EditProductService', () => {
  let editProductUseCase: EditProductUseCase;
  let productRepository: ProductRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ProductRepository',
          useClass: ProductRepositoryInMemory,
        },
        {
          provide: 'EditProductUseCase',
          useFactory: (productRepository) =>
            new EditProductService(productRepository),
          inject: ['ProductRepository'],
        },
      ],
    }).compile();

    editProductUseCase = module.get<EditProductUseCase>('EditProductUseCase');
    productRepository = module.get<ProductRepositoryPort>('ProductRepository');
  });

  test('Should Edit product', async () => {
    const product: Product = await Product.new({
      id: v4(),
      name: 'Product Name',
      image: 'product image',
      price: 50,
      quantity: 10,
    });

    jest.spyOn(productRepository, 'getProduct').mockImplementation(async () => {
      return product;
    });

    const editProductPort: EditProducPort = {
      productId: product.getId(),
      name: 'New Product Name',
      image: 'New image url',
      price: 30,
      quantity: 15,
    };

    await product.edit({
      name: editProductPort.name,
      image: editProductPort.image,
      price: editProductPort.price,
      quantity: editProductPort.quantity,
    });

    const expectedProductDto: ProductUseCaseDto =
      ProductUseCaseDto.newFromProduct(product);
    const resultProductDto: ProductUseCaseDto =
      await editProductUseCase.execute(editProductPort);

    Reflect.set(expectedProductDto, 'editedAt', product.getEditedAt());
    Reflect.set(resultProductDto, 'editedAt', product.getEditedAt());
    expect(expectedProductDto).toStrictEqual(resultProductDto);
  });

  test('Should throw exception if product was not found', async () => {
    const editProductPort: EditProducPort = {
      productId: v4(),
      name: 'New Product Name',
      image: 'New image url',
      price: 30,
      quantity: 15,
    };

    jest.spyOn(productRepository, 'getProduct').mockImplementation(async () => {
      return undefined;
    });

    expect.hasAssertions();

    try {
      await editProductUseCase.execute(editProductPort);
    } catch (error) {
      const exception: Exception<ClassValidationDetails> =
        error as Exception<ClassValidationDetails>;

      expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      expect(exception).toBeInstanceOf(Exception);
    }
  });
});
