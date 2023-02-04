import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { CreateUserUseCase } from '@core/Domain/user/usecase/CreateUserUsecase';
import { DeleteUserUseCase } from '@core/domain/user/usecase/DeleteUserUseCase';
import { EditUserUseCaseDto } from '@core/domain/user/usecase/dto/EditUserUseCaseDto';
import { UserUsecaseDto } from '@core/Domain/user/usecase/dto/UserUsecaseDto';
import { EditUserUseCase } from '@core/domain/user/usecase/EditUserUseCase';
import { GetUserUseCase } from '@core/domain/user/usecase/getUserUseCase';
import { CreateUserAdapter } from '@infrastructure/adapter/usecase/user/CreateUserAdapter';
import { DeleteUserAdapter } from '@infrastructure/adapter/usecase/user/DeleteUserAdapter';
import { EditUserAdapter } from '@infrastructure/adapter/usecase/user/EditUserAdapter';
import { GetUserAdapter } from '@infrastructure/adapter/usecase/user/GetUserAdapter';
import { HttpAuth } from '../auth/decorator/HttpAuth';
import { UserRoles } from '@core/common/enums/UserEnums';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,

    @Inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,

    @Inject(UserDITokens.EditUserUseCase)
    private readonly editUserUseCase: EditUserUseCase,

    @Inject(UserDITokens.DeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post('new')
  public async createUser(@Body() body) {
    const adapter: CreateUserAdapter = await CreateUserAdapter.new({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
    });

    const createdUser: UserUsecaseDto = await this.createUserUseCase.execute(
      adapter,
    );

    return CoreApiResponse.success(createdUser, 'User Created');
  }

  @Get('user')
  public async getUser(@Body() body) {
    const adapter: GetUserAdapter = await GetUserAdapter.new({
      email: body.email,
    });

    const user: UserUsecaseDto = await this.getUserUseCase.execute(adapter);
    return CoreApiResponse.success(user, 'User found');
  }

  @Patch('edit')
  public async editUser(@Body() body) {
    const adapter: EditUserAdapter = await EditUserAdapter.new({
      email: body.email,
      name: body.name,
      password: body.password,
    });

    const editedUser: EditUserUseCaseDto = await this.editUserUseCase.execute(
      adapter,
    );

    return CoreApiResponse.success(editedUser, 'user was Edited successfully');
  }

  @HttpAuth(UserRoles.ADMIN)
  @Delete('delete')
  public async deleteUser(@Body() body) {
    const adapter: DeleteUserAdapter = await DeleteUserAdapter.new({
      email: body.email,
    });

    const deletedUser = await this.deleteUserUseCase.execute(adapter);
    if (deletedUser) {
      return CoreApiResponse.success('User Deleted');
    }

    return deletedUser;
  }
}
