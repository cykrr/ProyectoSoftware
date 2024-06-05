import { GradeDto } from "./grade.dto";
import { CourseDto } from "./course.dto";


export class TopicDto {
  id: number | undefined;
  name: string | undefined;
  grade: GradeDto | undefined;
}

export class UserInfoDto {
  uid: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  role: string | undefined;
  assignedCourses: CourseDto[] | undefined;


}
