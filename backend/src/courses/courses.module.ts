import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Student, Teacher, User } from 'src/users/user.entity';
import { Grade } from 'src/grade/grade.entity';
import { Topic, Unidad } from 'src/topic/topic.entity';
import { DocumentModule } from 'src/document/document.module';
import { MDocument } from 'src/document/mdocument.entity';
import { DocumentService } from 'src/document/document.service';

@Module({
  providers: [CoursesService, UsersService, DocumentService],
  imports: [
    TypeOrmModule.forFeature([
      MDocument,
      Course,
      User,
      Teacher,
      Student,
      Grade,
      Topic,
    ]),
    CoursesModule,
    UsersModule,
    DocumentModule,
  ],
  exports: [
    CoursesService,
    TypeOrmModule.forFeature([
      MDocument,
      Course,
      User,
      Teacher,
      Student,
      Grade,
      Topic,
    ]),
    DocumentModule,
  ],
})
export class CoursesModule {
  constructor(private coursesService: CoursesService) {}
}
