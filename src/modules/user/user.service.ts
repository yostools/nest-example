import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateInput } from './inputs/user-create.input';
import { User } from './user.model';

/**
 * User service
 */
@Injectable()
export class UserService {

  counter: number = 0;
  users: { [id: string]: User } = {};

  /**
   * Create user
   */
  create(input: UserCreateInput): User {
    const user = new User();
    Object.assign(user, input);
    user.id = 'User' + this.counter;
    this.users[user.id] = user;
    return user;
  }

  /**
   * Get uer via ID
   */
  get(id: string): User {
    const user = this.users[id];

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
