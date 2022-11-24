import { Body, Controller, Param } from "@nestjs/common";
import { Patch, Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { EditUserDto } from './dto/editUser.dto';

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    // @Post('signin')
        
    // signin(@Body() dto: AuthDto){
        
    //    return this.authService.signin(dto)
    // }

    @Patch('edit/:id')
    edit(@Param() params: any, @Body() dto: EditUserDto){
        const {id} = params
        const numberId = parseInt(id)
        const editedUser = this.authService.edit(numberId, dto)
        return editedUser
    }

    @Post('signup')

    signup(@Body() dto: AuthDto){
               
        return this.authService.signup(dto)
    }

}