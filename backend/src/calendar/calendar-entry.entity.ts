import { Course } from "src/courses/course.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CalendarEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Course, (course) => course.calendarEntries)
  course: Course;
}