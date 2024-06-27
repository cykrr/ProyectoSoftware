import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { GradeService } from 'src/grade/grade.service';
import { TopicService } from 'src/topic/topic.service';
import { RecvCreateCourseDto } from './recv-create-course.dto';
import { UsersService } from 'src/users/users.service';
import { CalendarEntry } from 'src/calendar/calendar-entry.entity';

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
    return { success: true, message: 'Course created', data: course };
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
      success: true,
      message: 'Course found',
      data: {
        ...course,
        unidades: await this.courseService.obtenerUnidades(id),
      },
    };
  }

  @Get(':id/calendar')
  async getCalendar(@Param('id') id: number): Promise<object> {
    const course = await this.courseService.findCourse(id);
    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return {
      success: true,
      data: course.calendarEntries,
    };
  }

  @Post(':id/calendar/add_entry')
  async addCalendarEntry(
    @Param('id') courseId: number,
    @Body() body: { date: string; name: string; description: string },
  ): Promise<object> {
    const year = Number.parseInt(body.date.split('-')[0]);
    const month = Number.parseInt(body.date.split('-')[1]) - 1;
    const day = Number.parseInt(body.date.split('-')[2]);

    const ddate = new Date(year, month, day, 12, 0, 0, 0);
    console.log(body);
    console.log(year, month, day, ddate.toString());
    const course = await this.courseService.findCourse(courseId);
    if (!course) {
      return {
        success: false,
        message: `Course ${courseId} not found`,
      };
    }
    const newEntry = await this.courseService.createCalendarEntry({
      date: ddate,
      name: body.name,
      description: body.description,
    });

    course.calendarEntries.push(newEntry);
    this.courseService.update(course);
    return {
      success: true,
      message: 'Calendar entry added',
    };
  }

  @Post(':id/calendar/edit_entry')
  async editEntry(
    @Param('id') id: number,
    @Body()
    body: { id: number; date: string; name: string; description: string },
  ): Promise<object> {
    console.log(body);
    const year = Number.parseInt(body.date.split('-')[0]);
    const month = Number.parseInt(body.date.split('-')[1]) - 1;
    const day = Number.parseInt(body.date.split('-')[2]);

    const ddate = new Date(year, month, day, 12, 0, 0, 0);
    const editedEntry = await this.courseService.editCalendarEntry({
      id: body.id,
      name: body.name,
      description: body.description,
      date: ddate,
    });
    if (!editedEntry) {
      return {
        success: false,
        message: 'Entry not found',
      };
    }

    return {
      success: true,
      data: editedEntry,
    };
  }

  @Post(':id/calendar/:entryid/delete')
  async deleteEntry(
    @Param('id') id: number,
    @Param('entryid') entryid: number,
  ): Promise<object> {
    const course = await this.courseService.findCourse(id);
    if (!course) {
      return {
        success: false,
        message: `Course ${id} not found`,
      };
    }
    const entry = course.calendarEntries.find((e) => e.id == entryid);
    if (!entry) {
      return {
        success: false,
        message: `Entry ${entryid} not found`,
      };
    } else {
      await this.courseService.removeCalendarEntry(id, entryid);
      return {
        success: true,
        message: 'Entry deleted',
      };
    }
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

  @Put(':id/documents')
  async editDocFromCourse(
    @Param('id') courseId: number,
    @Body() body: { id: number; name: string },
  ) {
    console.log('Editing document', courseId, body.id, body);

    if (await this.courseService.editDocument(courseId, body)) {
      return {
        success: true,
        message: 'Documento editado',
      };
    } else {
      return {
        success: false,
        message: 'Documento no encontrado',
      };
    }
  }

  @Delete(':id/documents/:document_id/')
  async removeDocFromCourse(
    @Param('id') courseId: number,
    @Param('document_id') docId: number,
  ): Promise<object> {
    console.log('Removing document', courseId, docId);
    const course = await this.courseService.findCourse(courseId);
    if (!course) {
      return {
        success: false,
        message: `Course ${courseId} not found`,
      };
    }

    course.documents = course.documents.filter((doc) => doc.id !== docId);
    this.courseService.update(course);
    return {
      success: true,
      message: 'Document removed from course',
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
