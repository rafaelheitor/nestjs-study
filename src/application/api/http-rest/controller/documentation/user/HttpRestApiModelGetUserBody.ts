import { ApiProperty } from "@nestjs/swagger";

export class HttpRestApiModelGetUserBody {
    @ApiProperty({type: 'string'})
    public email: string
}