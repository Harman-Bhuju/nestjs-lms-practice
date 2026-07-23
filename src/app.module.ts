import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { LoggerModule } from 'nestjs-pino';
import { MyLoggerModule } from './logger/logger.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService)=>({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [User,Course],
      synchronize: false,        
      }),
    }),
    AuthModule,
    UserModule,
    CoursesModule,
    MyLoggerModule,
    LoggerModule.forRoot(),
   ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// npm run migration:run
// npm run migration:revert
// npm run migration:show

// npm run migration:create -- src/core/CONFIG/migrations/AddUsersTable
// npm run migration:generate -- src/core/CONFIG/migrations/AddUsersTable