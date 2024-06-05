import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { TeacherCourseComponent } from './teacher-course/teacher-course.component';
import { UserInfoDto } from '../dtos/user_info.dto';
import { CourseDto } from '../dtos/course.dto';

@Component({
  selector: 'app-teacher-home',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, JsonPipe, RouterModule, TeacherCourseComponent],
  templateUrl: './teacher-home.component.html',
  styleUrl: './teacher-home.component.css'
})
export class TeacherHomeComponent {
teacher: UserInfoDto | undefined;
selectedCourse: number;
  constructor(userService: UserService) {
    this.selectedCourse = -1;
    try {
      userService.getTeacherData(localStorage.getItem('uid')!, localStorage.getItem('token')!).subscribe((res) => {
        console.log(res);
        this.teacher = res;
      });
    } catch (e) {
      console.log(e);
    }
  }
  onCourseClick(course: any) {
    this.selectedCourse = course.id;
    console.log(this.getSelectedCourse());
  }

  getSelectedCourse(): CourseDto|undefined
  {
    const course = this.teacher?.assignedCourses?.find((course) => course.id === this.selectedCourse);
    return course;
  }
}
