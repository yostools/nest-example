import { IsEmail, IsOptional } from 'class-validator';
import { Field, ObjectType } from 'type-graphql/dist';

/**
 * User model
 */
@ObjectType({ description: 'User' })
export class User {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /**
   * ID of the user
   */
  @Field({ description: 'ID of the user'})
  id: string;

  /**
   * E-Mail address of the user
   */
  @Field({ description: 'Email of the user', nullable: true })
  @IsEmail()
  email: string;

}
