import { Entity } from '@core/common/entity/Entity';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { v4 } from 'uuid';
import { compare, genSalt, hash } from 'bcrypt';
import { RemovableEntity } from '@core/common/entity/RemovableEntity';
import { Nullable } from '@core/common/type/CommonTypes';
import { UserRoles } from '@core/common/enums/UserEnums';

export type createUserPayload = {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  removedAt?: Date;
  editedAt?: Date;
  role?: UserRoles;
};

export type editUserPayload = {
  name?: string;
  password?: string;
};

export class User extends Entity<string> implements RemovableEntity {
  @IsString()
  private name: string;

  @IsEmail()
  private email: string;

  @IsString()
  private password: string;

  @IsDate()
  private readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  private removedAt: Nullable<Date>;

  @IsDate()
  @IsOptional()
  private editedAt: Nullable<Date>;

  @IsEnum(UserRoles)
  private readonly role: UserRoles;

  private constructor(payload: createUserPayload) {
    super();
    this.id = payload.id || v4();
    this.name = payload.name;
    this.email = payload.email;
    this.password = payload.password;
    this.createdAt = payload.createdAt || new Date();
    this.removedAt = payload.removedAt || null;
    this.editedAt = payload.editedAt || null;
    this.role = payload.role || UserRoles.CLIENT;
  }

  public async hashPassword(): Promise<void> {
    const salt: string = await genSalt();
    this.password = await hash(this.password, salt);
    await this.validate();
  }

  public async editPassword(password: string): Promise<void> {
    const salt: string = await genSalt();
    this.password = await hash(password, salt);
    await this.validate();
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole() {
    return this.role;
  }

  public async edit(payload: editUserPayload): Promise<User> {
    if (payload.name) {
      this.name = payload.name;
      this.editedAt = new Date();
    }

    if (payload.password) {
      await this.editPassword(payload.password);
      this.editedAt = new Date();
    }

    return this;
  }

  public getEditedAt(): Date {
    return this.editedAt;
  }

  public async remove(): Promise<void> {
    this.removedAt = new Date();
    this.validate();
  }

  getRemovedAt(): Nullable<Date> {
    return this.removedAt;
  }

  public static async new(payload: createUserPayload): Promise<User> {
    const user: User = new User(payload);
    await user.hashPassword();
    await user.validate();
    return user;
  }
}
