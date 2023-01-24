import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserDITokens } from 'src/Core/common/di/UserDITokens';
import { CreateUserUseCase } from 'src/Core/Domain/user/usecase/CreateUserUsecase';
import { UserUsecaseDto } from 'src/Core/Domain/user/usecase/dto/UserUsecaseDto';
import { CreateUserAdapter } from 'src/infrastructure/adapter/usecase/user/CreateUserAdapter';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('new')
  public async createUser(@Body() body) {
    const adapter: CreateUserAdapter = await CreateUserAdapter.new({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    const createdUser: UserUsecaseDto = await this.createUserUseCase.execute(
      adapter,
    );

    return createdUser;
  }
}
