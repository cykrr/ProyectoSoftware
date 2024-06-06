import { Course } from 'src/courses/course.entity';
import { Grade } from 'src/grade/grade.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Grade, (grade) => grade.topics)
  grade: Grade;

  @OneToOne(() => Course, (course) => course.topic)
  course: Course;

  files: string[];
}
