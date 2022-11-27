import { Body, Controller, Param } from '@nestjs/common';
import {
  Delete,
  Get,
  Patch,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UserService } from './user.service';
import { AuthDto } from './dto';
import { EditUserDto } from './dto/editUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('edit/:id')
  edit(@Param() params: any, @Body() dto: EditUserDto) {
    const id = parseInt(params.id);
    const editedUser = this.userService.edit(id, dto);
    return editedUser;
  }

  @Post('new')
  new(@Body() dto: AuthDto) {
    return this.userService.new(dto);
  }

  @Get('allusers')
  getAll() {
    return this.userService.getAll();
  }

  @Delete('delete/:id')
  delete(@Param() params: any) {
    const id = parseInt(params.id);
    return this.userService.delete(id);
  }
}
