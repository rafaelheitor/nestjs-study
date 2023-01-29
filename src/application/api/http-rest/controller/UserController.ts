import { Body, Controller, Get, Inject, Post, Patch } from '@nestjs/common';
import { UserDITokens } from 'src/Core/domain/user/di/UserDITokens';
import { CreateUserUseCase } from 'src/Core/Domain/user/usecase/CreateUserUsecase';
import { UserUsecaseDto } from 'src/Core/Domain/user/usecase/dto/UserUsecaseDto';
import { EditUserUseCase } from 'src/core/domain/user/usecase/EditUserUseCase';
import { GetUserUseCase } from 'src/core/domain/user/usecase/getUserUseCase';
import { CreateUserAdapter } from 'src/infrastructure/adapter/usecase/user/CreateUserAdapter';
import { EditUserAdapter } from 'src/infrastructure/adapter/usecase/user/EditUserAdapter';
import { GetUserAdapter } from 'src/infrastructure/adapter/usecase/user/GetUserAdapter';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,

    @Inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,

    @Inject(UserDITokens.EditUserUseCase)
    private readonly editUserUseCase: EditUserUseCase,
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

  @Get('user')
  public async getUser(@Body() body) {
    const adapter: GetUserAdapter = await GetUserAdapter.new({
      email: body.email,
    });

    const user: UserUsecaseDto = await this.getUserUseCase.execute(adapter);
    return user;
  }

  @Patch('edit')
  public async editUser(@Body() body) {
    const adapter: EditUserAdapter = await EditUserAdapter.new({
      email: body.email,
      name: body.name,
      password: body.password,
    });
    console.log(adapter);

    const editedUser: UserUsecaseDto = await this.editUserUseCase.execute(
      adapter,
    );

    return editedUser;
  }
}
