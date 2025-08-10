import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir conexiones desde frontend
  app.enableCors({
    origin: true, // Permitir cualquier origen en desarrollo
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configurar puerto y host
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
  console.log(`📊 API de ventas lista para recibir peticiones`);
}
bootstrap();
