import { User } from '@core/Domain/user/entity/User';
import { AbstractRepository } from '@core/common/persistence/Repository';

export interface UserRepositoryPort extends AbstractRepository<User> {
  getByEmail(email: string): Promise<User>;
}
