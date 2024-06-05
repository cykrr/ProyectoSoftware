import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course, Unidad } from './course.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Student, Teacher, User } from 'src/users/user.entity';
import { Grade } from 'src/grade/grade.entity';
import { Topic } from 'src/topic/topic.entity';

@Module({
  providers: [CoursesService, UsersService],
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Unidad,
      User,
      Teacher,
      Student,
      Grade,
      Topic,
    ]),
    CoursesModule,
    UsersModule,
  ],
  exports: [
    CoursesService,
    TypeOrmModule.forFeature([
      Course,
      Unidad,
      User,
      Teacher,
      Student,
      Grade,
      Topic,
    ]),
  ],
})
export class CoursesModule {
  constructor(private coursesService: CoursesService) {}
}
