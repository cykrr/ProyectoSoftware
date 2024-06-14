import { DocumentDto } from "./new-file.dto";
import { TopicDto } from "./grade.dto";
import { UserInfoDto } from "./user_info.dto";
import { UnidadDto } from "./unidad.dto";


export class EventDto {
  id?: number | undefined;
  name: string | undefined;
  description: string | undefined;
  date?: Date | undefined;
}

export class DayDto {
  id: number | undefined;
  date: Date | undefined;
  events?: EventDto[] | undefined;
}

export class CourseDto {
  id: number | undefined;
  name: string | undefined;
  isActive: boolean | undefined;
  topic: TopicDto | undefined;
  assignedTeacher: UserInfoDto | undefined;
  documents?: DocumentDto[] | undefined;
  unidades: UnidadDto[] | undefined;
  calendarEntries: EventDto[] | undefined;
}

