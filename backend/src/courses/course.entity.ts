import { Topic } from 'src/topic/topic.entity';
import { Teacher } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Teacher, (teacher) => teacher.assignedCourses)
  assignedTeacher: Teacher;

  @OneToOne(() => Topic, (topic) => topic.course)
  @JoinColumn()
  topic: Topic;

  @OneToMany(() => Unidad, (unidad) => unidad.course)
  unidades: Unidad[];
}

@Entity()
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Course, (course) => course.unidades)
  course: Course;
}