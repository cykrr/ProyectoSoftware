import { GradeDto } from "./grade.dto";
import { CourseDto } from "./course.dto";



export class UserInfoDto {
  uid: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  role: string | undefined;
  assignedCourses: CourseDto[] | undefined;


}
