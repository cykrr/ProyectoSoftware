import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { Student, Teacher, User } from './users/user.entity';
import { UsersModule } from './users/users.module';

import { CoursesModule } from './courses/courses.module';
import { Course, Unidad } from './courses/course.entity';
import { Session } from './session/session.entity';
import { GradeModule } from './grade/grade.module';
import { Grade } from './grade/grade.entity';
import { GradeService } from './grade/grade.service';
import { CoursesService } from './courses/courses.service';
import { UsersService } from './users/users.service';
import { Topic } from './topic/topic.entity';
import { AppController } from './app.controller';
import { TopicService } from './topic/topic.service';
import { UsersController } from './users/users.controller';
import { GradeController } from './grade/grade.controller';
import { InjectConnection, InjectModel, MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './courses/courses.controller';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { SessionService } from './session/session.service';
import { SessionModule } from './session/session.module';
import { FilesModule } from './files/files.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest',
      entities: [User, Teacher, Student, Course, Unidad, Session, Grade, Topic],
      synchronize: true, // TODO: Don't use in prod.
    }),
    MongooseModule.forRoot('mongodb://localhost/nest'),
    UsersModule,
    CoursesModule,
    GradeModule,
    SessionModule,
    FilesModule,
  ],
  providers: [
    UsersService,
    CoursesService,
    GradeService,
    AppService,
    TopicService,
    LoginService,
    SessionService,
  ],
  controllers: [
    AppController,
    UsersController,
    GradeController,
    CourseController,
    LoginController,
  ],
})
export class AppModule {
  constructor(
    private dataSource: DataSource,
    private readonly gradeService: GradeService,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
    private readonly topicService: TopicService,
    @InjectConnection() private conn: Connection,
  ) {}
  async onModuleInit() {
    console.log("dropall")
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
    await this.conn.db.dropDatabase();

    let grade = await this.gradeService.create({
      grade: 1,
      gradePoint: 'A',
    });

    let grade2 = await this.gradeService.create({
      grade: 2,
      gradePoint: 'B',
    });

    this.usersService.createStudent({
      firstName: 'Jane',
      lastName: 'Doe',
      rut: 12345678,
      password: 'password',
      grade,
    });

    this.usersService.createStudent({
      firstName: 'Alice',
      lastName: 'Doe',
      rut: 87654321,
      password: 'password',
      grade,
    });

    const me = await this.usersService.createTeacher({
      firstName: 'Benjamin',
      lastName: 'Robles',
      rut: 21256405,
      password: 'admin',
    });

    const grades = [grade, grade2];
    const topics = ['Matemática', 'Ciencias Naturales', 'Historia', 'Lenguaje'];
    for (let grade of grades)
      for (const topic of topics)
        grade = await this.gradeService.addTopic(grade, {
          name: topic,
        });

    this.coursesService.create({
      name: 'Introducción a las matemáticas',
      grade: grade2,
      topic: grade2.topics[0],
      assignedTeacher: me,
    });
  }
}
