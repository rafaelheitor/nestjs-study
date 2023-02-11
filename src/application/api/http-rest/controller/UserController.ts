import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Patch,
  Delete,
  HttpStatus,
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
import { HttpRestApiModelCreateUserBody } from './documentation/user/HttpRestApiModelCreateUserBody';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpRestApiResponseUser } from './documentation/user/HttpRestApiResponseUser';
import { HttpRestApiModelEditUserBody } from './documentation/user/HttpRestApiModelEditUserBody';
import { HttpRestApiResponseEditedUser } from './documentation/user/HttpRestApiResponseEditedUser';
import { HttpRestApiModelGetUserBody } from './documentation/user/HttpRestApiModelGetUserBody';
import { HttpRestApiModelDeleteUserBody } from './documentation/user/HttpRestApiModelDeleteUserBody';
import { HttpRestApiResponseDeletedUser } from './documentation/user/HttpRestApiResponseDeletedUser';

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
  @ApiBody({ type: HttpRestApiModelCreateUserBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseUser })
  public async createUser(@Body() body: HttpRestApiModelCreateUserBody) {
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

  @ApiBody({ type: HttpRestApiModelGetUserBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseUser })
  @Get('user')
  public async getUser(@Body() body: HttpRestApiModelGetUserBody) {
    const adapter: GetUserAdapter = await GetUserAdapter.new({
      email: body.email,
    });

    const user: UserUsecaseDto = await this.getUserUseCase.execute(adapter);
    return CoreApiResponse.success(user, 'User found');
  }

  @Patch('edit')
  @ApiBody({ type: HttpRestApiModelEditUserBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseEditedUser })
  public async editUser(@Body() body: HttpRestApiModelEditUserBody) {
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
  @ApiBody({ type: HttpRestApiModelDeleteUserBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseDeletedUser })
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
