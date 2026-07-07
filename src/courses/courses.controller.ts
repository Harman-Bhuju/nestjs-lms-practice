import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/enum/user.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';


@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post('create')
  @Roles(Role.ADMIN, Role.TEACHER)
  create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser('id') userId: number
  ) {
    return this.coursesService.create(createCourseDto, userId);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('my')
  @Roles(Role.ADMIN, Role.TEACHER)
  findMyCourses(@CurrentUser('id') userId: number) {
    return this.coursesService.findMyCourses(userId)
  }

  @Get('my/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER)
  findMyCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser('id') userId: number
  ) {
    return this.coursesService.findMyCourse(courseId, userId)
  }

  @Patch('update/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER)
  update(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.update(courseId, updateCourseDto, user);
  }

  @Delete('delete/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.coursesService.remove(courseId, user);
  }

  @Get(':courseId')
  findOne(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.coursesService.findOne(courseId);
  }


}
