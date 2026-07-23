import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from "cookie-parser"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyLoggerService } from './logger/logger.service';
import { Logger } from 'nestjs-pino';
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    //logger: ['log', 'fatal', 'error', 'warn', 'debug', and 'verbose']
    bufferLogs: true
  });

  //customized
  // app.useLogger(app.get(MyLoggerService))

  //pino logger
  app.useLogger(app.get(Logger))

  app.useLogger

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  )

  const config = new DocumentBuilder()
    .setTitle('LMS')
    .setDescription('This is a LMS API documentation')
    .setVersion('1.0')
    .addCookieAuth('refreshToken')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
