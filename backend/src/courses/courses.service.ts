import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './create_course.dto';
import { Unidad } from 'src/topic/topic.entity';
import { DocumentService } from 'src/document/document.service';
import { AlreadyHasCourseError } from 'src/errors/already-has-course.error';
import { CalendarEntry } from 'src/calendar/calendar-entry.entity';
import { CalendarService } from 'src/calendar/calendar.service';
import { MDocument } from 'src/document/mdocument.entity';
import { LargeNumberLike } from 'crypto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private documentService: DocumentService,
    private calendarService: CalendarService,
  ) {}

  async update(course: DeepPartial<Course>): Promise<Course> {
    return await this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({ relations: ['topic.documents'] });
  }

  async create(course: CreateCourseDto): Promise<Course> {
    const createdCourse = await this.courseRepository.create(course);
    if (course.topic.course?.id != null)
      throw new AlreadyHasCourseError(course.topic.id);
    return await this.courseRepository.save(createdCourse);
  }

  async editDocument(
    courseId: number,
    document: { id: number; name: string },
  ): Promise<MDocument> {
    console.log ('edit document', courseId, document)
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['documents'],
    });
    console.log("Course", course)
    if (!course) return null;

    for (const doc of course.documents) {
      if (doc.id === document.id) {
        console.log('found');
        doc.name = document.name;
        return await this.documentService.save(doc);
      }
    }
  }

  async obtenerUnidades(courseId: number): Promise<Unidad[]> {
    console.log('otner');
    const unidades = [];
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['topic.unidades.documents', 'documents.unidad'],
    });
    if (!course.documents) return [];
    for (const doc of course!.documents) {
      console.log(doc);
      let match = unidades.find((u) => u.id === doc.unidad.id);
      if (!match) {
        unidades.push({
          id: doc.unidad.id,
          name: doc.unidad.name,
          documents: [{ ...doc, unidad: undefined }],
        });
        match = unidades.at(-1);
      } else match.documents.push(doc);
    }
    return unidades;
  }

  async findCourse(id: number): Promise<Course> {
    return await this.courseRepository.findOne({
      where: { id },
      relations: [
        'topic.unidades',
        'assignedTeacher',
        'topic.grade.students',
        'calendarEntries',
        'documents',
      ],
    });
  }
  async createCalendarEntry(createCalendarEntryDto: {
    name: string;
    description: string;
    date: Date;
  }): Promise<CalendarEntry> {
    return await this.calendarService.create(createCalendarEntryDto);
  }

  async editCalendarEntry(editCalendarEntryDto: {
    id: number;
    name: string;
    description: string;
    date: Date;
  }): Promise<CalendarEntry> {
    return await this.calendarService.update(editCalendarEntryDto);
  }

  async removeCalendarEntry(id: number, entryid: number): Promise<boolean> {
    const course = await this.findCourse(id);
    const entry = course.calendarEntries.find((e) => e.id === entryid);
    if (!entry) return false;
    else {
      await this.calendarService.remove(entry);
      return true;
    }
  }
}
