export class ProductDITokens {
  //UseCase Tokens
  public static readonly CreateProductUseCase: unique symbol = Symbol(
    'CreateProductUseCase',
  );

  public static readonly EditProductUseCase: unique symbol =
    Symbol('EditProductUseCase');

  //Repositories
  public static readonly ProductRepository: unique symbol =
    Symbol('ProductRepository');
}
