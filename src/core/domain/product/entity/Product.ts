import { Entity } from '@core/common/entity/Entity';
import { RemovableEntity } from '@core/common/entity/RemovableEntity';
import { Nullable } from '@core/common/type/CommonTypes';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { v4 } from 'uuid';
import { CreateProductPayload } from './type/createProductPayload';
import { EditProductPayload } from './type/EditProductPayload';

export class Product extends Entity<string> implements RemovableEntity {
  @IsString()
  private name: string;

  @IsString()
  private image: string;

  @IsNumber()
  private price: number;

  @IsNumber()
  private quantity: number;

  @IsDate()
  private createdAt: Date;

  @IsDate()
  @IsOptional()
  private editedAt: Nullable<Date> | null;

  @IsDate()
  @IsOptional()
  private removedAt: Nullable<Date> | null;

  private constructor(payload: CreateProductPayload) {
    super();
    this.id = payload.id || v4();
    this.name = payload.name;
    this.image = payload.image;
    this.price = payload.price;
    this.quantity = payload.quantity;
    this.createdAt = payload.creteadAt || new Date();
    this.editedAt = payload.editedAt || null;
    this.removedAt = payload.removedAt || null;
  }

  public getName() {
    return this.name;
  }

  public getImage() {
    return this.image;
  }

  public getPrice() {
    return this.price;
  }

  public getQuantity() {
    return this.quantity;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getEditedAt() {
    return this.editedAt;
  }

  public async remove(): Promise<void> {
    this.removedAt = new Date();
    this.validate();
  }

  public getRemovedAt() {
    return this.removedAt;
  }

  public static async new(payload: CreateProductPayload): Promise<Product> {
    const product: Product = new Product(payload);
    await product.validate();
    return product;
  }

  public async edit(payload: EditProductPayload) {
    if (payload.name) {
      this.name = payload.name;
      this.editedAt = new Date();
      this.validate();
    }

    if (payload.price) {
      this.price = payload.price;
      this.editedAt = new Date();
      this.validate();
    }

    if (payload.quantity) {
      this.quantity = payload.quantity;
      this.editedAt = new Date();
      this.validate();
    }

    if (payload.image) {
      this.image = payload.image;
      this.editedAt = new Date();
      this.validate();
    }
    return this;
  }
}
