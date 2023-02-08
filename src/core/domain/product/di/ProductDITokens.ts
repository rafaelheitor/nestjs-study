export class ProductDITokens {
  //UseCase Tokens
  public static readonly CreateProductUseCase: unique symbol = Symbol(
    'CreateProductUseCase',
  );

  //Repositories
  public static readonly ProductRepository: unique symbol =
    Symbol('ProductRepository');
}
