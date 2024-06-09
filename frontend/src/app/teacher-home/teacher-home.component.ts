import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TeacherCourseComponent } from './teacher-course/teacher-course.component';
import { UserInfoDto } from '../dtos/user_info.dto';
import { CourseDto } from '../dtos/course.dto';
import { CourseService } from '../course.service';
import { Observable, lastValueFrom, map } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-teacher-home',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, JsonPipe, RouterModule, TeacherCourseComponent, FontAwesomeModule],
  templateUrl: './teacher-home.component.html',
  styleUrl: './teacher-home.component.css'
})
export class TeacherHomeComponent {
teacher: UserInfoDto | undefined;
selectedCourseId: number | undefined;
selectedCourse: CourseDto|undefined;
faAngleRight=faAngleRight
  constructor(userService: UserService, private courseService: CourseService, private router: Router) {
    this.selectedCourseId = -1;
    this.selectedCourse = undefined;
    userService.getTeacherData(localStorage.getItem('uid')!, localStorage.getItem('token')!).subscribe({
      next: (res) => {
        if (!res.success) {
          alert(res.message)
          router.navigate(['/login'])
        } else {
          this.teacher = res.data;
        }
      },
      error: (err) => {
        console.log(err);
        router.navigate(['/login'])
      }
    });
    //     (res) => {
    //       if (!res.success) {
    //         alert(res.message)
    //         router.navigate(['/login'])
    //       }
    //       console.log(res);
    //       this.teacher = res.data;
    //     }, (err) => {
    //       console.log(err);
    //       router.navigate(['/login'])
    //     });
    // } catch (e) {
    //   console.log(e);
    // }
  }
  async onCourseClick(course: any) {
    this.selectedCourseId = course.id;
    this.selectedCourse = (await lastValueFrom(this.courseService.getCourse(this.selectedCourseId!))).data
    // console.log(this.selectedCourse)


  }
  async shouldReload(b: boolean) {
    if (!b) return
    console.log("reloading :3")
    this.selectedCourse = (await lastValueFrom(this.courseService.getCourse(this.selectedCourseId!))).data
  }


}
