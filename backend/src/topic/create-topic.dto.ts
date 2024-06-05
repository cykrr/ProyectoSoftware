import { Course } from 'src/courses/course.entity';
import { Grade } from 'src/grade/grade.entity';

export class CreateTopicDto {
  name: string;
  grade?: Grade | undefined;
  course?: Course | undefined;
}
