import { User } from "src/user/Entity/User"
import { AuthDto } from '../../../auth/dto/auth.dto';
import { EditUserDto } from '../../../auth/dto/editUser.dto';


export interface IUserRepository {
    save(user: AuthDto): Promise<User>
    edit(id: number, payload: EditUserDto): Promise<User>
}