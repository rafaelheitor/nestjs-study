import { Product } from '../../entity/Product';
import { ProductUseCaseDto } from './ProductUseCaseDto';

describe('ProductUseCaseDto', () => {
  test('Should create a new ProductUseCaseDto', async () => {
    const product: Product = await createProduct();
    const productUsecaseDto: ProductUseCaseDto =
      ProductUseCaseDto.newFromProduct(product);

    expect(productUsecaseDto.name).toBe(product.getName());
    expect(productUsecaseDto.image).toBe(product.getImage());
    expect(productUsecaseDto.price).toBe(product.getPrice());
    expect(productUsecaseDto.quantity).toBe(product.getQuantity());
    expect(productUsecaseDto.createdAt).toEqual(product.getCreatedAt());
  });

  test('should create a list from ProductUseCaseDto', async () => {
    const product: Product = await createProduct();

    const productListUsecaseDto: ProductUseCaseDto[] =
      ProductUseCaseDto.newListFromProduct([product]);

    expect(productListUsecaseDto[0].name).toBe(product.getName());
    expect(productListUsecaseDto[0].image).toBe(product.getImage());
    expect(productListUsecaseDto[0].price).toBe(product.getPrice());
    expect(productListUsecaseDto[0].quantity).toBe(product.getQuantity());
    expect(productListUsecaseDto[0].createdAt).toEqual(product.getCreatedAt());
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
