export type CreateProductPayload = {
  id?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  creteadAt?: Date;
  editedAt?: Date;
  removedAt?: Date;
};
