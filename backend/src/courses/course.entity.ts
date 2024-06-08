import { MDocument } from 'src/document/mdocument.entity';
import { Topic, Unidad } from 'src/topic/topic.entity';
import { Teacher } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
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

  @ManyToMany(() => MDocument, { cascade: false })
  @JoinTable()
  documents: MDocument[];

  get unidades(): Unidad[] {
    // Use a Set to ensure uniqueness of unidades
    const unidadesSet = new Set<Unidad>();
    
    // Iterate over documents and add their unidades to the Set
    this.documents.forEach(document => {
      if (document.unidad) {
        unidadesSet.add(document.unidad);
      }
    });

    // Convert the Set to an array and return
    return Array.from(unidadesSet);
  }
}
