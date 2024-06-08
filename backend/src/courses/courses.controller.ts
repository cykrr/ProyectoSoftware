import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { GradeService } from 'src/grade/grade.service';
import { TopicService } from 'src/topic/topic.service';
import { RecvCreateCourseDto } from './recv-create-course.dto';
import { UsersService } from 'src/users/users.service';
import { create } from 'domain';
import { DocumentService } from 'src/document/document.service';
import { AlreadyHasCourseError } from 'src/errors/already-has-course.error';

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
  ): Promise<object> {
    console.log('[Cursos] creando curso');
    console.log(`[Cursos] buscando grado con id ${createCourse.gradeId}`);
    const grade = await this.gradeService.find(createCourse.gradeId);
    // console.log('Found grade', grade);
    const topic = await this.topicService.find(createCourse.topicId);
    console.log(`[Cursos] buscando tema con id ${createCourse.topicId}`);
    // console.log('Found topic', topic);

    console.log(
      `[Cursos] buscando usuario con id ${createCourse.assignedTeacherId}`,
    );
    const teacher = await this.userService.findTeacher(
      createCourse.assignedTeacherId,
    );
    // console.log('Found teacher', teacher);

    let course = null;
    try {
      course = await this.courseService.create({
        name: createCourse.name,
        grade: grade,
        topic: topic,
        assignedTeacher: teacher,
      });
    } catch (e) {
      return { success: false, message: e.message };
    }

    if (!course.documents) course.documents = [];
    for (const fileId of createCourse.attachFilesForm.documents) {
      console.log(`[Cursos] buscando documento con id ${fileId}`);
      const document = await this.topicService.findDocument(fileId);
      course.documents.push(document);
    }

    this.courseService.update(course);

    try {
      this.userService.addTeacherCourse(teacher, course);
    } catch (e) {
      return { success: false, message: e.message };
    }
    return { success: true, message: 'Course created', data : course};
  }
  @Get()
  async getCourses(): Promise<object> {
    const courses = await this.courseService.findAll();
    return courses;
  }

  @Get(':id')
  async findCourse(@Param('id') id: number): Promise<object> {
    const course = await this.courseService.findCourse(id);
    if (!course) {
      return {
        success: false,
        message: `Course ${id} not found`,
      };
    }
    return {
      ...course,
      unidades: await this.courseService.obtenerUnidades(id),
    };
  }
  @Post(':id/addfile/:file_id')
  async addFileToCourse(
    @Param('id') courseId: number,
    @Param('file_id') fileId: string,
  ): Promise<object> {
    const course = await this.courseService.findCourse(courseId);
    if (!course) {
      return {
        success: false,
        message: `Course ${courseId} not found`,
      };
    }

    const document = await this.topicService.findDocument(fileId);

    course.documents.push(document);
    this.courseService.update(course);
    return {
      success: true,
      message: 'File added to course',
    };
  }

  // Actually adds id to topic
  // @Get(':id/:file_id')
  // async addFileToCourse(
  //   @Param('id') courseId: number,
  //   @Param('file_id') fileId: string,
  // ): Promise<void> {
  //   const course = await this.courseService.findCourse(courseId);
  //   if (!course) {
  //     return;
  //   }
  //   course.topic.files.push(fileId);
  //   this.topicService.update(course.topic);
  // }
}
