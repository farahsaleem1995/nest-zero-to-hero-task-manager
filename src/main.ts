import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = 3000;

  // app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(port);

  logger.log(`Start listening on ${port}`);
}
bootstrap();
