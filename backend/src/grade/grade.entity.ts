import { Course } from 'src/courses/course.entity';
import { Topic } from 'src/topic/topic.entity';
import { Student } from 'src/users/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  grade: number;
  @Column()
  gradePoint: string;
  @OneToMany(() => Student, (student) => student.grade)
  students: Student[];

  @OneToMany(() => Topic, (topic) => topic.grade)
  topics: Topic[];
}
