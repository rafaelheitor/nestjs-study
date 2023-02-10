import { Product } from '../../entity/Product';
import { DeleteProductUseCaseDto } from './DeleteProductUseCaseDto';

describe('DeleteProductDto', () => {
  test('Should create DeleteProductDto', async () => {
    const product: Product = await createProduct();
    const deleteProductDto: DeleteProductUseCaseDto =
      DeleteProductUseCaseDto.newFromProduct(product);

    expect(deleteProductDto.id).toBe(product.getId());
    expect(deleteProductDto.name).toBe(product.getName());
    expect(deleteProductDto.removedAt).toEqual(product.getRemovedAt());
  });
});

async function createProduct() {
  const customRemovedAt: Date = new Date(Date.now() - 5000);

  const product: Product = await Product.new({
    name: 'Product name',
    image: 'Produc image url',
    price: 40,
    quantity: 10,
    removedAt: customRemovedAt,
  });

  return product;
}
