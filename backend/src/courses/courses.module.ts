import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Grade } from 'src/grade/grade.entity';
import { DocumentModule } from 'src/document/document.module';
import { DocumentService } from 'src/document/document.service';
import { CalendarModule } from 'src/calendar/calendar.module';
import { CalendarService } from 'src/calendar/calendar.service';

@Module({
  providers: [CoursesService, UsersService, DocumentService, CalendarService],
  imports: [
    CalendarModule,
    UsersModule,
    DocumentModule,
    TypeOrmModule.forFeature([Course, Grade]),
  ],
  exports: [
    CalendarModule,
    TypeOrmModule.forFeature([Course, Grade]),
    DocumentModule,
  ],
})
export class CoursesModule {
  constructor() {}
}
