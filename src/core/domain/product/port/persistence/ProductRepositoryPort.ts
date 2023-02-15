import { Product } from '../../entity/Product';
import { EditProductPayload } from '../../entity/type/EditProductPayload';

export interface ProductRepositoryPort {
  saveProduct(product: Product): Promise<Product>;
  getProduct(id: string): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
  editProduct(id: string, data: EditProductPayload): Promise<Product>;
  delete(id: string): void;
}
