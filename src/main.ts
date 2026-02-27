import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Transforma tipos básicos (ej: string a number) automáticamente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades del request body que no estén en el DTO
      forbidNonWhitelisted: true, // Rechaza la petición si trae datos extraños
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Gestor Académico API')
    .setDescription('API REST para gestión de cursos, profesores y alumnos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
