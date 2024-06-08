import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class RecvCreateCourseDto {
  name: string;
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  assignedTeacherId: number;
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  topicId: number;
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  gradeId: number;

  attachFilesForm: { documents: string[] };
}
