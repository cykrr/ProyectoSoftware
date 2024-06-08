import { DocumentDto } from "./new-file.dto";
import { TopicDto } from "./grade.dto";
import { UserInfoDto } from "./user_info.dto";
import { UnidadDto } from "./unidad.dto";

export class CourseDto {
  id: number | undefined;
  name: string | undefined;
  isActive: boolean | undefined;
  topic: TopicDto | undefined;
  assignedTeacher: UserInfoDto | undefined;
  documents?: DocumentDto[] | undefined;
  unidades: UnidadDto[] | undefined;
}

