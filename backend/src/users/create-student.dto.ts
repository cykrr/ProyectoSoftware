import { Grade } from 'src/grade/grade.entity';
import { CreateUserDto } from './create_user.dto';

export class CreateStudentDto extends CreateUserDto {
  grade: Grade;
}
