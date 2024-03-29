export class ProductDITokens {
  //UseCase Tokens
  public static readonly CreateProductUseCase: unique symbol = Symbol(
    'CreateProductUseCase',
  );

  public static readonly EditProductUseCase: unique symbol =
    Symbol('EditProductUseCase');

  public static readonly GetProductUseCase: unique symbol =
    Symbol('GetProductUseCase');

  public static readonly GetProductListUseCase: unique symbol = Symbol(
    'GetProductListUseCase',
  );

  public static readonly DeleteProductUseCase: unique symbol = Symbol(
    'DeleteProductUseCase',
  );

  //Repositories
  public static readonly ProductRepository: unique symbol =
    Symbol('ProductRepository');
}
