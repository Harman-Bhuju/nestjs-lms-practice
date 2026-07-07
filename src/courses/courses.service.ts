import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { Role } from 'src/user/enum/user.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) { }

  create(
    createCourseDto: CreateCourseDto,
    userId: number) {

    const newCourse = this.courseRepository.create({
      ...createCourseDto,
      createdBy: {
        id: userId,
      },
    });

    return this.courseRepository.save(newCourse)

  }

  async findAll() {
    const courses = await this.courseRepository.find();

    if (courses.length === 0) {
      throw new NotFoundException('No courses found');
    }
    return courses;
  }

  async findOne(courseId: number) {
    const course = await this.courseRepository.findOne(
      {
        where: {
          id: courseId
        }
      }
    );

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async findMyCourses(userId: number) {
    const courses = await this.courseRepository.find({
      where: {
        createdBy: {
          id: userId,
        },
      },
    });

    if (courses.length === 0) {
      throw new NotFoundException('You have no courses.');
    }

    return courses;
  }

  async findMyCourse(courseId: number, userId: number) {
    const course = await this.courseRepository.findOne(
      {
        where: {
          id: courseId,
          createdBy: {
            id: userId,
          },
        }
      });

    if (!course) {
      throw new NotFoundException('You have no course with this ID.');
    }

    return course;
  }


  async update(
    courseId: number,
    updateCourseDto: UpdateCourseDto,
    user: AuthenticatedUser) {

    let course: Course;

    if (user.role === Role.ADMIN) {
      course = await this.findOne(courseId);
    } else {
      course = await this.findMyCourse(courseId, user.id);
    }

    Object.assign(course, updateCourseDto);

    return this.courseRepository.save(course);

  }

  async remove(
    courseId: number, user: AuthenticatedUser
  ) {

    let course: Course;

    if (user.role == Role.ADMIN) {
      // can delete anything
      course = await this.findOne(courseId);

      if (!course) {
        throw new NotFoundException('Course not found');
      }

    }
    else {
      course = await this.findMyCourse(courseId, user.id)
    }

    course.deletedBy = {
      id: user.id,
    } as User;

    course.deletedByAdmin = user.role === Role.ADMIN;

    await this.courseRepository.softRemove(course);

    return {
      message: 'Course moved to recycle bin.',
    };
  }
}
