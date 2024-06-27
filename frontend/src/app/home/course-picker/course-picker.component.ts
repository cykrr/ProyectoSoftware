import { Component, Input } from '@angular/core';
import { UserInfoDto } from '../../dtos/user_info.dto';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { faAngleRight, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { CourseDto } from '../../dtos/course.dto';
import { logOff } from '../../common';

@Component({
  selector: 'app-course-picker',
  standalone: true,
  imports: [RouterModule, RouterLink, FontAwesomeModule, CommonModule],
  templateUrl: './course-picker.component.html',
  styleUrl: './course-picker.component.css'
})

export class CoursePickerComponent {
  @Input({required: true})
  user: UserInfoDto | undefined;
  courses: CourseDto[] | undefined;
  faAngleRight=faAngleRight
  faRightFromBracket = faRightFromBracket
  logOff = logOff
  constructor(private router: Router) {}

  ngOnChanges() {
    console.log("[CoursePickerComponent] Getting courses for user...")
    console.log(this.user)
    if (!this.user) return
    if (this.user!.role! == 'Teacher') {
      console.log("[CoursePickerComponent] User is a teacher, getting assigned courses")
      this.courses = this.user!.assignedCourses;
    } else {
      this.courses = []
      for (let topic of this.user!.grade!.topics!) {
        if (topic.course!) {
          this.courses.push(topic.course!)
        }
      }
    }
  }

}
