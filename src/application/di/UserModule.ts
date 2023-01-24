import { Module } from "@nestjs/common";
import { UserDITokens } from "src/Core/common/di/UserDITokens";
import { UserRepositoryInMemory } from "src/infrastructure/adapter/persistence/UserRepositoryAdapter";
import { CreateUserService } from "src/Core/service/user/usecase/CreateUserService";
import { UserController } from "../api/http-rest/controller/UserController";

@Module({
    providers:[
        {
            provide: UserDITokens.UserRepository,
            useClass: UserRepositoryInMemory,
          },
          {
            provide: UserDITokens.CreateUserUseCase,
            useFactory: (userRepository) => {
              return new CreateUserService(userRepository);
            },
            inject: [UserDITokens.UserRepository],
          },
    ],
    controllers: [ UserController],
})

export class UserModule{}