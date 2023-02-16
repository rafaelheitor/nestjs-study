import { Product } from '@core/domain/product/entity/Product';
import { Order } from './Order';
import { Payment } from './type/PaymentEnum';

describe('Order entity', () => {
  test('Should create a order instance with required parameters', async () => {
    const product: Product = await createProduct();
    const mockProducts: Product[] = [product];
    const mockOrder: Order = await Order.new({
      userId: 'Mock User id',
      products: mockProducts,
    });

    expect(mockOrder.getProducts()[0].getId()).toBe(product.getId());
    expect(mockOrder.getProducts()[0].getImage()).toBe(product.getImage());
    expect(mockOrder.getProducts()[0].getPrice()).toBe(product.getPrice());
    expect(mockOrder.getProducts()[0].getQuantity()).toBe(
      product.getQuantity(),
    );
    expect(mockOrder.getUserId()).toBe('Mock User id');
    expect(mockOrder.getPaymentMethod()).toBe('CASH');
  });

  test('Should create order instance with optional parameters', async () => {
    const product: Product = await createProduct();
    const mockProducts: Product[] = [product];
    const customCreatedAt: Date = new Date(Date.now() - 5000);

    const mockOrder: Order = await Order.new({
      userId: 'Mock User id',
      products: mockProducts,
      paymentMethod: Payment.PIX,
      createdAt: customCreatedAt,
    });

    expect(mockOrder.getPaymentMethod()).toBe('PIX');
    expect(mockOrder.getCreatedAt()).toBe(customCreatedAt);
    expect(mockOrder.getProducts()[0].getId()).toBe(product.getId());
    expect(mockOrder.getProducts()[0].getImage()).toBe(product.getImage());
    expect(mockOrder.getProducts()[0].getPrice()).toBe(product.getPrice());
    expect(mockOrder.getProducts()[0].getQuantity()).toBe(
      product.getQuantity(),
    );
    expect(mockOrder.getUserId()).toBe('Mock User id');
  });
});

async function createProduct(): Promise<Product> {
  return Product.new({
    name: 'Product name',
    image: 'Product Image',
    price: 10,
    quantity: 20,
  });
}
