import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิด CORS สำหรับทั้ง local และ production
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Local Nuxt
      'https://apis-nuxt.vercel.app',  // Production Vercel
      /\.vercel\.app$/  // All Vercel preview deployments
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // ใช้ PORT จาก environment variable (สำคัญสำหรับ Railway!)
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend running on port ${port}`);
}

bootstrap();