import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  await app.listen(process.env.PORT ?? 4000);
  
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 4000}`);
  console.log(`SSE Test page: http://localhost:${process.env.PORT ?? 4000}/sse-test.html`);



  
}
bootstrap();

