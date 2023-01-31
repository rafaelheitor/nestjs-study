export class UserDITokens {
  // Use-cases

  public static readonly CreateUserUseCase: unique symbol =
    Symbol('CreateUserUseCase');

  public static readonly GetUserUseCase: unique symbol =
    Symbol('GetUserUseCase');

  public static readonly EditUserUseCase: unique symbol =
    Symbol('EditUserUseCase');

  public static readonly DeleteUserUseCase: unique symbol =
    Symbol('DeleteUserUseCase');

  // Repositories

  public static readonly UserRepository: unique symbol =
    Symbol('UserRepository');
}
