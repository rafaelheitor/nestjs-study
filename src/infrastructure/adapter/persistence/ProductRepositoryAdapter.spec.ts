import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryInMemory } from './ProductRepositoryAdapter';

describe('Product Repository in memory', () => {
  let productRepositoryInMemory: ProductRepositoryInMemory;
  beforeAll(async () => {
    productRepositoryInMemory = await ProductRepositoryInMemory.getInstance();
  });

  test('Should save product in the Repository', async () => {
    const product = await createProduct();
    const savedProduct = await productRepositoryInMemory.saveProduct(product);

    expect(savedProduct.getName()).toBe(product.getName());
    expect(savedProduct.getImage()).toBe(product.getImage());
    expect(savedProduct.getPrice()).toBe(product.getPrice());
    expect(savedProduct.getQuantity()).toBe(product.getQuantity());
  });

  test('Should find product in the repository', async () => {
    const product: Product = await createProduct();
    const savedProduct = await productRepositoryInMemory.saveProduct(product);
    const foundProduct = await productRepositoryInMemory.getProduct(
      savedProduct.getId(),
    );

    expect(foundProduct).toStrictEqual(savedProduct);
  });

  test('Should edit product', async () => {
    const product: Product = await createProduct();
    const savedProduct: Product = await productRepositoryInMemory.saveProduct(
      product,
    );

    const editedProduct: Product = await productRepositoryInMemory.editProduct(
      savedProduct.getId(),
      {
        name: 'New product name',
        image: 'New product image',
        price: 55,
        quantity: 5,
      },
    );

    expect(editedProduct.getName()).toBe('New product name');
    expect(editedProduct.getImage()).toBe('New product image');
    expect(editedProduct.getPrice()).toBe(55);
    expect(editedProduct.getQuantity()).toBe(5);
  });

  test('Should delete product', async () => {
    const product: Product = await createProduct();
    const savedProduct: Product = await productRepositoryInMemory.saveProduct(
      product,
    );

    await productRepositoryInMemory.delete(savedProduct.getId());

    const foundProduct: Product = await productRepositoryInMemory.getProduct(
      savedProduct.getId(),
    );

    expect(foundProduct).toBe(undefined);
  });
});

async function createProduct() {
  const product = await Product.new({
    name: 'Product name',
    image: 'Url image',
    price: 50,
    quantity: 10,
  });
  return product;
}
