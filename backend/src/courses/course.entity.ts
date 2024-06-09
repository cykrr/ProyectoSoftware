import { CalendarEntry } from 'src/calendar/calendar-entry.entity';
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

  @ManyToMany(() => MDocument, { cascade: false })
  @JoinTable()
  documents: MDocument[];

  @OneToMany(() => CalendarEntry, (entry) => entry.course)
  calendarEntries: CalendarEntry[];
}
