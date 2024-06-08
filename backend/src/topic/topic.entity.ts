import { Course } from 'src/courses/course.entity';
import { MDocument } from 'src/document/mdocument.entity';
import { Grade } from 'src/grade/grade.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @OneToOne(() => Course, (course) => course.topic, { cascade: true })
  course: Course;

  @OneToMany(() => Unidad, (unidad) => unidad.topic, { cascade: true })
  unidades: Unidad[];
}

@Entity()
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Topic, (topic) => topic.unidades)
  topic?: Topic;

  @ManyToMany(() => MDocument, (document) => document.unidad, {
    cascade: true,
  })
  @JoinTable()
  documents: MDocument[];
}
