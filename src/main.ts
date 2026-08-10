import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));

  // interceptor
  app.useGlobalInterceptors(new ResponseInterceptor())

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('쉐프의 밀키트(ChefKit) API')
    .setDescription('쉐프가 밀키트 레시피를 등록하고 사용자가 구매할 수 있는 밀키트 판매 플랫폼 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
