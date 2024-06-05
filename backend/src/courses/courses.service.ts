import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './create_course.dto';

class Response<T> {
  success?: boolean;
  message: string;
  data?: T;
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}
  async create(course: CreateCourseDto): Promise<Response<Course>> {
    if (course?.topic?.course) {
      return {
        success: false,
        message: 'Topic already has a course',
        data: null,
      };
    } else if (
      await this.courseRepository.findOne({
        where: { topic: course?.topic },
        relations: ['topic'],
      })
    ) {
      return {
        success: false,
        message: 'Topic already has a course',
        data: null,
      };
    }
    try {
      const createdCourse = await this.courseRepository.create(course);
      return {
        success: true,
        message: 'Course created',
        data: await this.courseRepository.save(createdCourse),
      };
    } catch (e) {
      console.log('Duplicate entry');
      return null;
    }
  }
  async findCourse(id: number): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['topic.grade.students', 'assignedTeacher'],
    });
  }
}
