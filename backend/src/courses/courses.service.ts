import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './create_course.dto';
import { BResponse } from 'src/common';
import { Unidad } from 'src/topic/topic.entity';
import { DocumentService } from 'src/document/document.service';
import { AlreadyHasCourseError } from 'src/errors/already-has-course.error';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private documentService: DocumentService,
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

  async obtenerUnidades(courseId: number): Promise<Unidad[]> {
    console.log('otner');
    const unidades = [];
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['topic.unidades.documents', 'documents.unidad'],
    });
    console.log(course);
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
    return this.courseRepository.findOne({
      where: { id },
      relations: ['topic.unidades', 'assignedTeacher', 'topic.grade.students'],
    });
  }
}
