import { Global, Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { NestHttpExceptionFilter } from '@application/api/http-rest/exception-filter/NestHttpExceptionFilter';
import { ConfigModule } from '@nestjs/config';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: NestHttpExceptionFilter,
  },
];

@Global()
@Module({
  providers: [...providers],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/local.env',
    }),
  ],
})
export class InfrastructureModule {}
