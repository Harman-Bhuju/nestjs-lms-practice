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
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CourseResponseDto } from './dto/course-response.dto';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @ApiOperation({
    summary: 'Create a Course',
  })
  @ApiCreatedResponse({
    description: 'Course Created Successfully',
    type: CourseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Course data'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required'
  })
  @ApiForbiddenResponse({
    description: 'Only admins and teachers can create courses',
  })
  @Post('create')
  @Roles(Role.ADMIN, Role.TEACHER)
  create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser('id') userId: number
  ) {
    return this.coursesService.create(createCourseDto, userId);
  }

  @ApiOperation({
    summary: 'Get all courses',
  })
  @ApiOkResponse({
    description: 'List of all courses',
    type: CourseResponseDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @ApiOperation({
    summary: 'Get my courses',
  })
  @ApiOkResponse({
    description: 'List of courses created by the current user',
    type: CourseResponseDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'Only admins and teachers can access this endpoint',
  })
  @Get('my')
  @Roles(Role.ADMIN, Role.TEACHER)
  findMyCourses(@CurrentUser('id') userId: number) {
    return this.coursesService.findMyCourses(userId)
  }

  @ApiOperation({
    summary: 'Get my course with course id',
  })
  @ApiOkResponse({
    description: 'Course found',
    type: CourseResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Course not found',
  })
  @ApiParam({
    name: 'courseId',
    type: Number,
    example: 1,
    description: 'ID of the course',
  })
  @Get('my/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER)
  findMyCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser('id') userId: number
  ) {
    return this.coursesService.findMyCourse(courseId, userId)
  }

  @ApiOperation({
    summary: 'Update a course',
  })
  @ApiOkResponse({
    description: 'Course updated successfully',
    type: CourseResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Course not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid course data',
  })
  @ApiParam({
    name: 'courseId',
    type: Number,
    example: 1,
    description: 'ID of the course',
  })
  @Patch('update/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER)
  update(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.update(courseId, updateCourseDto, user);
  }

  @ApiOperation({
    summary: 'Delete a course',
  })
  @ApiOkResponse({
    description: 'Course deleted successfully',
  })
  @ApiParam({
    name: 'courseId',
    type: Number,
    example: 1,
    description: 'ID of the course',
  })
  @Delete('delete/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.coursesService.remove(courseId, user);
  }


  @ApiOperation({
    summary: 'Get a course with course id',
  })
  @ApiOkResponse({
    description: 'Course found',
    type: CourseResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Course not found',
  })
  @ApiParam({
    name: 'courseId',
    type: Number,
    example: 1,
    description: 'ID of the course',
  })
  @Get(':courseId')
  findOne(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.coursesService.findOne(courseId);
  }


}
