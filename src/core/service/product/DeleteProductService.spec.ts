import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { DeleteProductPort } from '@core/domain/product/port/usecase/DeleteProductPort';
import { DeleteProductUseCase } from '@core/domain/product/usecase/DeleteProductUseCase';
import { DeleteProductUseCaseDto } from '@core/domain/product/usecase/dto/DeleteProductUseCaseDto';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProductService } from './DeleteProductService';

describe('DeleteProductService', () => {
  let deleteProductUseCase: DeleteProductUseCase;
  let productRepository: ProductRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductDITokens.ProductRepository,
          useClass: ProductRepositoryInMemory,
        },
        {
          provide: ProductDITokens.DeleteProductUseCase,
          useFactory: (productRepository) =>
            new DeleteProductService(productRepository),
          inject: [ProductDITokens.ProductRepository],
        },
      ],
    }).compile();

    deleteProductUseCase = module.get<DeleteProductUseCase>(
      ProductDITokens.DeleteProductUseCase,
    );
    productRepository = module.get<ProductRepositoryPort>(
      ProductDITokens.ProductRepository,
    );
  });

  test('Should Delete Product if it was found in repository', async () => {
    const product: Product = await createProduct();
    jest.spyOn(productRepository, 'getProduct').mockImplementation(async () => {
      return product;
    });

    const deleteProductPort: DeleteProductPort = {
      productId: product.getId(),
    };

    const expectedDeleteProductDto: DeleteProductUseCaseDto =
      DeleteProductUseCaseDto.newFromProduct(product);
    const resultDeleteProductDto: DeleteProductUseCaseDto =
      await deleteProductUseCase.execute(deleteProductPort);

    Reflect.set(
      expectedDeleteProductDto,
      'removedAt',
      resultDeleteProductDto.removedAt,
    );

    expect(expectedDeleteProductDto).toStrictEqual(resultDeleteProductDto);
  });

  test('Expect it throws a exception if product was not found', async () => {
    jest.spyOn(productRepository, 'getProduct').mockImplementation(async () => {
      return undefined;
    });

    expect.hasAssertions();

    try {
      await deleteProductUseCase.execute({
        productId: 'Some Id',
      });
    } catch (error) {
      const exception: Exception<ClassValidationDetails> =
        error as Exception<ClassValidationDetails>;

      expect(exception).toBeInstanceOf(Exception);
      expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
    }
  });
});

async function createProduct() {
  const product: Product = await Product.new({
    name: 'Product name',
    image: 'Produc image url',
    price: 40,
    quantity: 10,
  });

  return product;
}
