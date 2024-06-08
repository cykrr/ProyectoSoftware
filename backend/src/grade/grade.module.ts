import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './grade.entity';
import { GradeService } from './grade.service';
import { CoursesService } from 'src/courses/courses.service';
import { Course } from 'src/courses/course.entity';
import { UsersService } from 'src/users/users.service';
import { Student, Teacher, User } from 'src/users/user.entity';
import { TopicService } from 'src/topic/topic.service';
import { TopicModule } from 'src/topic/topic.module';
import { Topic } from 'src/topic/topic.entity';
import { GradeController } from './grade.controller';
import { DocumentModule } from 'src/document/document.module';
import { DocumentService } from 'src/document/document.service';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade, Course, User, Teacher, Student, Topic]),
    TopicModule,
    DocumentModule,
    FilesModule,
  ],
  providers: [
    GradeService,
    CoursesService,
    UsersService,
    TopicService,
    DocumentService,
    FilesService,
  ],
  exports: [TopicModule, DocumentModule],
  controllers: [GradeController],
})
export class GradeModule {
  constructor(
    private gradeService: GradeService,
    private coursesService: CoursesService,
    private topicService: TopicService,
  ) {}
}
