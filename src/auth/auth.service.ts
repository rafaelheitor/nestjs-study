import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService{

    constructor(private prisma: PrismaService){}

   async signup(dto: AuthDto) {

    try{
        const hash = await argon.hash(dto.password);

        const user = this.prisma.user.create({
            data: {
                email: dto.email,
                hash
            }
        })
        delete (await user).hash
        return user
        
    } catch(error){
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2002') {
                throw new ForbiddenException('Email em uso')
            }
        }
        throw error
    }
}

    
    signin() {
        return {message: 'I have signed in'}
    }
}