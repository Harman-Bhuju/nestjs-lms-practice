import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserAgentMiddleware, UserAgentOptions } from 'src/middlewares/user-agent.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    AuthModule
  ],
  controllers: [CoursesController],
  providers: [CoursesService,
    {
      provide: UserAgentOptions,
      useValue: {
        accepted: ["chrome"]
      }
    }
  ],
})

export class CoursesModule implements NestModule{

  configure(consumer: MiddlewareConsumer){
    consumer.apply(UserAgentMiddleware).forRoutes('courses')

  }
}
