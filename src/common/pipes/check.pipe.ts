import { ArgumentMetadata, BadRequestException, Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * The CheckPipe checks the permissibility of individual properties of inputs for the resolvers
 * in relation to the current user
 */
@Injectable({ scope: Scope.REQUEST })
export class CheckPipe implements PipeTransform<any> {

  /**
   * Constructor to inject context
   */
  constructor(@Inject(CONTEXT) private readonly context) {}

  /**
   * Check input
   */
  async transform(value: any, { metatype }: ArgumentMetadata) {

    // Get context
    console.log('Current context', this.context);

    // Return value if it is only a basic type
    if (!metatype || this.isBasicType(metatype)) {
      return value;
    }

    // Check values
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  /**
   * Checks if it is a basic type
   */
  private isBasicType(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }
}
