import { Entity } from '../../../common/entity/Entity';
import { IsDate, IsEmail, IsString } from 'class-validator';
import { v4 } from 'uuid';
import { compare, genSalt, hash } from 'bcrypt';

export type createUserPayload = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class User extends Entity<string> {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsDate()
  private readonly createdAt: Date;

  private constructor(payload: createUserPayload) {
    super();
    this.id = payload.id || v4();
    this.name = payload.name;
    this.email = payload.email;
    this.password = payload.password;
    this.createdAt = payload.createdAt || new Date();
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

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  public static async new(payload: createUserPayload): Promise<User> {
    const user: User = new User(payload);
    await user.hashPassword();
    await user.validate();
    return user;
  }
}
