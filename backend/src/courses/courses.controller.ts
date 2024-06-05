import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { GradeService } from 'src/grade/grade.service';
import { TopicService } from 'src/topic/topic.service';
import { RecvCreateCourseDto } from './recv-create-course.dto';
import { UsersService } from 'src/users/users.service';

@Controller('courses')
export class CourseController {
  constructor(
    private courseService: CoursesService,
    private gradeService: GradeService,
    private topicService: TopicService,
    private userService: UsersService,
  ) {}
  @Post('')
  async createCourse(
    @Body() createCourse: RecvCreateCourseDto,
  ): Promise<string> {
    console.log(
      'Creating course',
      createCourse.name,
      createCourse.gradeId,
      createCourse.topicId,
      createCourse.assignedTeacherId,
    );
    const grade = await this.gradeService.find(createCourse.gradeId);
    console.log('Found grade', grade);
    const topic = await this.topicService.find(createCourse.topicId);
    console.log('Found topic', topic);

    const teacher = await this.userService.findTeacher(
      createCourse.assignedTeacherId,
    );
    console.log('Found teacher', teacher);
    if (topic.course?.id != null) {
      return JSON.stringify({
        message: 'Topic already has a course',
        data: topic.course,
      });
    }
    const course = await this.courseService.create({
      name: createCourse.name,
      grade: grade,
      topic: topic,
      assignedTeacher: teacher,
    });
    this.userService.addTeacherCourse(teacher, course.data);
    if (!course) {
      return JSON.stringify({
        message: 'Course already exists',
      });
    } else {
      return JSON.stringify({
        ...course,
      });
    }
  }
  @Get(':id')
  async findCourse(id: number): Promise<string> {
    const course = await this.courseService.findCourse(id);
    if (!course) {
      return JSON.stringify({
        message: 'Course not found',
      });
    }
    console.log(course)
    return JSON.stringify({
      ...course,
    });
  }
  // Actually adds id to topic
  @Get(':id/:file_id')
  async addFileToCourse(
    @Param('id') courseId: number,
    @Param('file_id') fileId: string,
  ): Promise<void> {
    const course = await this.courseService.findCourse(courseId);
    if (!course) {
      return;
    }
    course.topic.files.push(fileId);
    this.topicService.update(course.topic);
  }
}
