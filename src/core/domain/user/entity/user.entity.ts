import { IsString } from 'class-validator';
import { v4 } from 'uuid';

export type createUserPayload = {
  id?: string;
  name: string;
  email: string;
  password: string;
};

export class User {
  @IsString()
  public id: string;

  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  private constructor(payload: createUserPayload) {
    this.id = payload.id || v4();
    this.name = payload.name;
    this.email = payload.email;
    this.password = payload.password;
  }

  public static new(payload: createUserPayload): User {
    const user: User = new User(payload);
    return user;
  }

  editPassword(password: string) {
    return (this.password = password);
  }
}
