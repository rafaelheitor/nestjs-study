import { Entity } from '../../../common/entity/Entity';
import { IsEmail, IsString } from 'class-validator';
import { v4 } from 'uuid';
import { compare, genSalt, hash } from 'bcrypt';

export type createUserPayload = {
  id?: string;
  name: string;
  email: string;
  password: string;
};

export class User extends Entity<string> {
  @IsString()
  public id: string;

  @IsString()
  public name: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  private constructor(payload: createUserPayload) {
    super();
    this.id = payload.id || v4();
    this.name = payload.name;
    this.email = payload.email;
    this.password = payload.password;
  }

  async hashPassword(): Promise<void> {
    const salt: string = await genSalt();
    this.password = await hash(this.password, salt);
    await this.validate();
  }

  async editPassword(password: string): Promise<void> {
    const salt: string = await genSalt();
    this.password = await hash(password, salt);
    await this.validate();
  }

  async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  public static async new(payload: createUserPayload): Promise<User> {
    const user: User = new User(payload);
    await user.hashPassword();
    await user.validate();
    return user;
  }
}
