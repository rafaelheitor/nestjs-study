import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpLocalAuthGuard } from '../auth/guard/HttpLocalAuthGuard';
import { HttpAuthService } from '../auth/HttpAuthService';
import {
  HttpLoggedInUser,
  HttpRequestWithUser,
} from '../auth/type/HttpAuthTypes';
import { HttpRestApiLoginBody } from './documentation/auth/HttpRestApiModelLogInBody';
import { HttpRestApiResponseLoggedInUser } from './documentation/auth/HttpRestApiResponseLoggedInUser';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: HttpAuthService) {}

  @Post('login')
  @UseGuards(HttpLocalAuthGuard)
  @ApiBody({ type: HttpRestApiLoginBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseLoggedInUser })
  public async login(
    @Req() request: HttpRequestWithUser,
  ): Promise<CoreApiResponse<HttpLoggedInUser>> {
    return CoreApiResponse.success(this.authService.login(request.user));
  }
}
