import { Course } from 'src/courses/course.entity';
import { Grade } from 'src/grade/grade.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TableInheritance,
  ChildEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  rut: number;

  @Column()
  passwordHash: string;

  role?: string;
}

@ChildEntity()
export class Student extends User {
  @ManyToOne(() => Grade, (grade) => grade.students)
  grade: Grade;
}

@ChildEntity()
export class Teacher extends User {
  @OneToMany(() => Course, (course) => course.assignedTeacher)
  assignedCourses: Course[];
}
