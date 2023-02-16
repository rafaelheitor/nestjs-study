import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Patch,
  Delete,
  HttpStatus,
  Param,
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
import { ApiBasicAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpRestApiResponseUser } from './documentation/user/HttpRestApiResponseUser';
import { HttpRestApiModelEditUserBody } from './documentation/user/HttpRestApiModelEditUserBody';
import { HttpRestApiResponseEditedUser } from './documentation/user/HttpRestApiResponseEditedUser';
import { HttpRestApiResponseDeletedUser } from './documentation/user/HttpRestApiResponseDeletedUser';
import { DeleteUserUseCaseDto } from '@core/domain/user/usecase/dto/DeleteUserUseCaseDto';
import { GetUserListUseCase } from '@core/domain/user/usecase/GetUserListUseCase';
import { HttpRestApiResponseUserList } from './documentation/user/HttpRestApiResponseUserList';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(UserDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,

    @Inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,

    @Inject(UserDITokens.GetUserListUseCase)
    private readonly getUserListUseCase: GetUserListUseCase,

    @Inject(UserDITokens.EditUserUseCase)
    private readonly editUserUseCase: EditUserUseCase,

    @Inject(UserDITokens.DeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post('new')
  @ApiBody({ type: HttpRestApiModelCreateUserBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseUser })
  public async createUser(
    @Body() body: HttpRestApiModelCreateUserBody,
  ): Promise<CoreApiResponse<UserUsecaseDto>> {
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

  @Get('/unique/:userId')
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseUser })
  public async getUser(
    @Param('userId') userId: string,
  ): Promise<CoreApiResponse<UserUsecaseDto>> {
    const adapter: GetUserAdapter = await GetUserAdapter.new({
      id: userId,
    });

    const user: UserUsecaseDto = await this.getUserUseCase.execute(adapter);
    return CoreApiResponse.success(user, 'User found');
  }

  @ApiBasicAuth()
  @HttpAuth(UserRoles.ADMIN)
  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    type: HttpRestApiResponseUserList,
  })
  async getAllUsers(): Promise<CoreApiResponse<UserUsecaseDto[]>> {
    const userList: UserUsecaseDto[] = await this.getUserListUseCase.execute();

    return CoreApiResponse.success(userList, 'List of all users');
  }

  @Patch('edit/:userId')
  @ApiBody({ type: HttpRestApiModelEditUserBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseEditedUser })
  public async editUser(
    @Param('userId') userId: string,
    @Body() body: HttpRestApiModelEditUserBody,
  ): Promise<CoreApiResponse<EditUserUseCaseDto>> {
    const adapter: EditUserAdapter = await EditUserAdapter.new({
      id: userId,
      name: body.name,
      password: body.password,
    });

    const editedUser: EditUserUseCaseDto = await this.editUserUseCase.execute(
      adapter,
    );

    return CoreApiResponse.success(editedUser, 'user was Edited successfully');
  }

  @ApiBasicAuth()
  @HttpAuth(UserRoles.ADMIN)
  @Delete('delete/:userId')
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseDeletedUser })
  public async deleteUser(
    @Param('userId') userId: string,
  ): Promise<CoreApiResponse<DeleteUserUseCaseDto>> {
    const adapter: DeleteUserAdapter = await DeleteUserAdapter.new({
      id: userId,
    });

    const deletedUser: DeleteUserUseCaseDto =
      await this.deleteUserUseCase.execute(adapter);

    return CoreApiResponse.success(deletedUser, 'User Deleted');
  }
}
