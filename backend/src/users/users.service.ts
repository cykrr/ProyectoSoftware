import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student, Teacher, User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateStudentDto } from './create-student.dto';
import { CreateTeacherDto } from './create-teacher.dto';
import { Course } from 'src/courses/course.entity';

@Injectable()
export class UsersService {
  addTeacherCourse(teacher: Teacher, course: Course) {
    if (!teacher) {
      throw new NotFoundException('No existe el profesor');
    }

    if (teacher.assignedCourses == null) {
      teacher.assignedCourses = [];
    }
    teacher.assignedCourses.push(course);
    this.teacherRepo.save(teacher);
  }
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,
  ) {}

  async getRole(id: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ id });
    if (user instanceof Student) {
      return 'Student';
    } else if (user instanceof Teacher) {
      return 'Teacher';
    }
    return 'unknown';
  }

  async findTeacher(id: number | undefined): Promise<Teacher | null> {
    // Also get course data
    if (!id) return null;
    return await this.teacherRepo.findOne({
      where: { id: id! },
      relations: [
        'assignedCourses',
        'assignedCourses.topic.grade',
        'assignedCourses.topic.grade.students',
        'assignedCourses.assignedTeacher',
        'assignedCourses.calendarEntries',
      ],
    });
  }

  async createTeacher(arg0: CreateTeacherDto) {
    const passwordHash = this.hashPassword(arg0.password);
    if (await this.exists(arg0.rut)) {
      console.log('User already exists');
      return;
      // throw new Error('User already exists');
    }

    const teacher = this.teacherRepo.create({
      firstName: arg0.firstName,
      lastName: arg0.lastName,
      rut: arg0.rut,
      passwordHash,
    });

    return await this.teacherRepo.save(teacher);
  }

  async createStudent(arg0: CreateStudentDto) {
    if (await this.exists(arg0.rut)) {
      console.log('User already exists');
      return;
      throw new Error('User already exists');
    }
    const u = this.studentRepo.create({
      passwordHash: this.hashPassword(arg0.password),
      ...arg0,
    });

    return await this.studentRepo.save(u);
  }

  async find(id: number): Promise<User> {
    try {
      const student = await this.studentRepo.findOne({
        where: { id },
        relations: [
          'grade.topics.course',
          'grade.topics.course.topic.grade',
          'grade.topics.course.topic.grade.students',
          'grade.topics.course.assignedTeacher',
        ],
      });
      const teacher = await this.teacherRepo.findOne({
        where: { id },
        relations: [
          'assignedCourses',
          'assignedCourses.topic.grade',
          'assignedCourses.topic.grade.students',
          'assignedCourses.assignedTeacher',
          'assignedCourses.calendarEntries',
        ],
      });
      return student || teacher;
    } catch (e) {
      console.log(e);
    }
  }

  async findByRut(rut: number): Promise<User | null> {
    const stud = await this.studentRepo.findOne({ where: { rut } });
    if (stud) {
      return { ...stud, role: 'Student' };
    }
    const teach = await this.teacherRepo.findOne({ where: { rut } });
    if (teach) {
      return { ...teach, role: 'Teacher' };
    }
  }

  async findStudent(id: number): Promise<Student | null> {
    const user = await this.studentRepo.findOneBy({ id });
    // return this.studentRepo.findOneBy({ user: user });
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  verifyPassword(password: string, hash: string): boolean {
    const val = bcrypt.compareSync(password, hash);
    return val;
  }

  async exists(rut: number): Promise<boolean> {
    return this.userRepository.findOne({ where: { rut } }).then((res) => {
      if (res) {
        return true;
      } else {
        return false;
      }
    });
  }
}
