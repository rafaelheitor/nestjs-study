import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { GetProductListUseCase } from '@core/domain/product/usecase/GetProductListUseCase';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';

export class GetProductListService implements GetProductListUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(): Promise<ProductUseCaseDto[]> {
    const products: Product[] = await this.productRepository.getAllProducts();
    return ProductUseCaseDto.newListFromProduct(products);
  }
}

describe('GetAllProductsService', () => {
  let getProductListUseCase: GetProductListUseCase;
  let productRepository: ProductRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductDITokens.ProductRepository,
          useClass: ProductRepositoryInMemory,
        },
        {
          provide: 'GetProductListUseCase',
          useFactory: (productRepository) =>
            new GetProductListService(productRepository),
          inject: [ProductDITokens.ProductRepository],
        },
      ],
    }).compile();

    getProductListUseCase = module.get<GetProductListUseCase>(
      'GetProductListUseCase',
    );

    productRepository = module.get<ProductRepositoryPort>(
      ProductDITokens.ProductRepository,
    );
  });

  test('Should return all products saved in repository', async () => {
    const product: Product = await createProduct();
    const mockProducts: Product[] = [product];

    jest
      .spyOn(productRepository, 'getAllProducts')
      .mockImplementation(async () => {
        return mockProducts;
      });

    const expectedProductDto: ProductUseCaseDto[] =
      ProductUseCaseDto.newListFromProduct(mockProducts);
    const resultProductDto: ProductUseCaseDto[] =
      await getProductListUseCase.execute();

    expect(expectedProductDto).toStrictEqual(resultProductDto);
  });
});

async function createProduct() {
  return Product.new({
    name: 'Product Name',
    image: 'Product Image Url',
    price: 10,
    quantity: 20,
  });
}
