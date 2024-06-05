import { Grade } from 'src/grade/grade.entity';
import { Topic } from 'src/topic/topic.entity';
import { Teacher } from 'src/users/user.entity';

export class CreateCourseDto {
  name: string;
  assignedTeacher: Teacher;
  topic: Topic;
  grade: Grade;
}
