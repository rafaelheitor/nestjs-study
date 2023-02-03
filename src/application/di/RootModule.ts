import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';
import { APP_FILTER } from '@nestjs/core';
import { NestHttpExceptionFilter } from '@application/api/http-rest/exception-filter/NestHttpExceptionFilter';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NestHttpExceptionFilter,
    },
  ],
})
export class RootModule {}
