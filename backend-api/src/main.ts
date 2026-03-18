import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิด CORS
  app.enableCors({
    origin: 'http://localhost:3000',  // Nuxt port
    methods: ['GET', 'POST'],
  });

  await app.listen(3001);
}
bootstrap();