import { Unidad } from 'src/courses/course.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MDocument {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  fileid: string;

  @ManyToOne(() => Unidad, (unidad) => unidad.documents)
  unidad: Unidad;
}
