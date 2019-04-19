import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserCreateInput } from './inputs/user-create.input';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(of => User)
export class UserResolver {

  /**
   * Import services
   */
  constructor(private readonly usersService: UserService) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  /**
   * Get user via ID
   */
  @Query(returns => User, { description: 'Get user with specified ID' })
  async getUser(@Args('id') id: string): Promise<User> {
    return await this.usersService.get(id);
  }

  // ===========================================================================
  // Mutations
  // ===========================================================================

  /**
   * Create new user
   */
  @Mutation(returns => User, { description: 'Create a new user' })
  async createUser(@Args('input') input: UserCreateInput): Promise<User> {
    return await this.usersService.create(input);
  }
}
