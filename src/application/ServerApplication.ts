import { config } from '@infrastructure/config/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './di/RootModule';
import { OpenAPIObject } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger/dist';

export class ServerApplication {
  private readonly port: number | string = config().ApiServerConfig.API_PORT;

  public async run(): Promise<void> {
    const app: NestExpressApplication =
      await NestFactory.create<NestExpressApplication>(RootModule);

    this.buildDocumentation(app);
    await app.listen(this.port);
  }

  private buildDocumentation(app: NestExpressApplication): void {
    const title: string = 'PetECia';
    const description: string = 'PetECia API documentation';
    const version: string = '1.0.0';

    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addSecurity('basic', {
        type: 'apiKey',
        in: 'header',
        name: config().ApiServerConfig.API_ACCESS_TOKEN_HEADER,
      })
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('documentation', app, document);
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
