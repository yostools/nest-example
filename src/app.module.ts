import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { CheckPipe } from './common/pipes/check.pipe';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [
    UserService,

    // [Global] The CheckPipe checks the permissibility of individual properties
    // of inputs for the resolvers in relation to the current user
    {
      provide: APP_PIPE,
      useClass: CheckPipe,
    },
  ],
})
export class AppModule {}
