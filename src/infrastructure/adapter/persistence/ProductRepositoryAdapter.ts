import { Product } from '@core/domain/product/entity/Product';
import { EditProductPayload } from '@core/domain/product/entity/type/EditProductPayload';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';

export class ProductRepositoryInMemory implements ProductRepositoryPort {
  private static instance: ProductRepositoryInMemory | null = null;
  private products: Product[] = [];

  static async getInstance(): Promise<ProductRepositoryInMemory> {
    if (ProductRepositoryInMemory.instance === null) {
      ProductRepositoryInMemory.instance = new ProductRepositoryInMemory();
    }
    return ProductRepositoryInMemory.instance;
  }

  async saveProduct(product: Product): Promise<Product> {
    const savedProduct: Product = product;
    this.products.push(savedProduct);
    return savedProduct;
  }
  async getProduct(id: string): Promise<Product> {
    const foundProduct: Product = this.products.find(
      (product) => product.getId() === id,
    );
    return foundProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }
  async editProduct(id: string, data: EditProductPayload): Promise<Product> {
    const foundProduct: Product = await this.getProduct(id);
    foundProduct.edit({
      name: data.name,
      image: data.image,
      price: data.price,
      quantity: data.quantity,
    });

    this.saveProduct(foundProduct);
    return foundProduct;
  }
  delete(id: string): void {
    this.products = this.products.filter((product) => product.getId() !== id);
  }
}
