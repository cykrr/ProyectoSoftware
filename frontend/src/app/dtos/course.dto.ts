import { TopicDto } from "./grade.dto";
import { UserInfoDto } from "./user_info.dto";

export class CourseDto {
  id: number | undefined;
  name: string | undefined;
  isActive: boolean | undefined;
  topic: TopicDto | undefined;
  assignedTeacher: UserInfoDto | undefined;
}

