import { IsEmail, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql/dist';

@InputType({ description: 'User input' })
export class UserInput {

  /**
   * Email of the user
   */
  @Field({ description: 'Email of the user', nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
}
