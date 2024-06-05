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

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade, Course, User, Teacher, Student, Topic]),
    TopicModule,
  ],
  providers: [GradeService, CoursesService, UsersService, TopicService],
  exports: [TopicModule],
  controllers: [GradeController],
})
export class GradeModule {
  constructor(
    private gradeService: GradeService,
    private coursesService: CoursesService,
    private topicService: TopicService,
  ) {}
}
