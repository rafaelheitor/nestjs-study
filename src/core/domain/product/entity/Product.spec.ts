import { Product } from './Product';
import { CreateProductPayload } from './type/CreateProductPayload';

describe('Product', () => {
  const expectedProduct: CreateProductPayload = {
    name: 'Product name',
    image: 'url image',
    price: 40,
    quantity: 12,
  };

  describe('New', () => {
    test('Should create a new product object with required parameters', async () => {
      const product: Product = await Product.new({
        name: expectedProduct.name,
        image: expectedProduct.image,
        price: expectedProduct.price,
        quantity: expectedProduct.quantity,
      });

      expect(product.getName()).toBe(expectedProduct.name);
      expect(product.getPrice()).toBe(expectedProduct.price);
      expect(product.getQuantity()).toBe(expectedProduct.quantity);
    });

    test('Should create a new product object with optional parameters', async () => {
      const customCreatedAt = new Date(Date.now() - 5000);
      const customEditedAt = new Date(Date.now() - 2000);
      const customRemovedAt = new Date(Date.now() - 1000);

      const product: Product = await Product.new({
        name: expectedProduct.name,
        image: expectedProduct.image,
        price: expectedProduct.price,
        quantity: expectedProduct.quantity,
        creteadAt: customCreatedAt,
        editedAt: customEditedAt,
        removedAt: customRemovedAt,
      });

      expect(product.getName()).toBe(expectedProduct.name);
      expect(product.getImage()).toBe(expectedProduct.image);
      expect(product.getPrice()).toBe(expectedProduct.price);
      expect(product.getQuantity()).toBe(expectedProduct.quantity);
      expect(product.getCreatedAt()).toEqual(customCreatedAt);
      expect(product.getEditedAt()).toEqual(customEditedAt);
      expect(product.getRemovedAt()).toEqual(customRemovedAt);
    });
  });

  describe('edit', () => {
    test('Should edit product if new values are provided', async () => {
      const product: Product = await Product.new({
        name: expectedProduct.name,
        image: expectedProduct.image,
        price: expectedProduct.price,
        quantity: expectedProduct.quantity,
      });

      await product.edit({
        name: 'New product name',
        quantity: 2,
        price: 10,
        image: 'New image url',
      });

      expect(product.getName()).toBe('New product name');
      expect(product.getImage()).toBe('New image url');
      expect(product.getPrice()).toBe(10);
      expect(product.getQuantity()).toBe(2);
    });

    test('Should not edit product if values are not provided', async () => {
      const product: Product = await Product.new({
        name: expectedProduct.name,
        image: expectedProduct.image,
        price: expectedProduct.price,
        quantity: expectedProduct.quantity,
      });

      await product.edit({});

      expect(product.getName()).toBe(expectedProduct.name);
      expect(product.getImage()).toBe(expectedProduct.image);
      expect(product.getPrice()).toBe(expectedProduct.price);
      expect(product.getQuantity()).toBe(expectedProduct.quantity);
    });
  });
});
