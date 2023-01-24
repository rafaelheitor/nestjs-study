import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";
import { UseCaseValidatableAdapter } from "src/Core/common/adapter/usecase/UseCaseValidatableAdapter";
import { CreateUserPort } from "src/Core/Domain/user/port/useCase/CreateUserPort";


@Exclude()
export class CreateUserAdapter extends UseCaseValidatableAdapter implements CreateUserPort {

    @Expose()
    @IsString()
    public name: string

    @Expose()
    @IsString()
    public email: string

    @Expose()
    @IsString()
    public password: string

    public static async new(payload: CreateUserPort): Promise<CreateUserAdapter> {
        const adapter: CreateUserAdapter = plainToClass(CreateUserAdapter, payload)
        await adapter.validate();
        return adapter
    }
}