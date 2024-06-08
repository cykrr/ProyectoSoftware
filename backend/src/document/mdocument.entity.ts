import { Course } from 'src/courses/course.entity';
import { Unidad } from 'src/topic/topic.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MDocument {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  fileid: string;

  @ManyToOne(() => Unidad, (unidad) => unidad.documents)
  unidad?: Unidad;

  @ManyToMany(() => Course, (course) => course.documents)
  courses?: Course[];
}
