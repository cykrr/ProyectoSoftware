import { CourseDto } from "./course.dto";
import { UnidadDto } from "./unidad.dto";
import { UserInfoDto } from "./user_info.dto";

export class TopicDto {
  id: number | undefined;
  name: string | undefined;
  grade: GradeDto | undefined;
  unidades: UnidadDto[] | undefined;
  course: CourseDto | undefined;
}

export class GradeDto {
  id: number | undefined;
  grade: number | undefined;
  gradePoint: string | undefined;
  topics: TopicDto[] | undefined;
  students: UserInfoDto[] | undefined;

}
