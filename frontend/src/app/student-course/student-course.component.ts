import { Component } from '@angular/core';
import { AddFileComponent } from '../teacher-home/add-file/add-file.component';
import { faAngleLeft, faAngleRight, faEdit, faFilePdf, faXmark, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { apiUrl } from '../enviroment';
import { CourseDto } from '../dtos/course.dto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserInfoDto } from '../dtos/user_info.dto';
import { UserService } from '../user/user.service';
import { CourseService } from '../course.service';
import { logOff } from '../common';

@Component({
  selector: 'app-student-course',
  standalone: true,
  imports: [AddFileComponent, FontAwesomeModule, RouterModule, CommonModule],
  templateUrl: './student-course.component.html',
  styleUrl: './student-course.component.css'
})
export class StudentCourseComponent {
  faEdit = faEdit
  faFilePdf = faFilePdf
  faAngleRight = faAngleRight
  faAngleLeft = faAngleLeft
  faRightFromBracket = faRightFromBracket
  faXmark = faXmark
  logOff = logOff

  apiUrl: string = apiUrl

  selectedCourseId: number | undefined = 1;
  selectedCourse: CourseDto | undefined;

  teacher: UserInfoDto | undefined;
  student: UserInfoDto | undefined;

  courses: CourseDto[]  = []

  constructor(private router: Router,
    private userService: UserService,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {

    const courseId = +this.route.snapshot.paramMap.get('courseId')!;
    console.log(courseId!)

    this.selectedCourse = (await this.courseService.getCourse(courseId!).toPromise())!.data;
    console.log(this.selectedCourse)

    console.log("StudentCourse")
    console.log("Getting user data")
    this.userService.getUserInfo().subscribe({
      next: (res) => {
        if (!res) alert("No user found")
        console.log(res! )
        this.student = res!;
        for (let topic of this.student!.grade!.topics!)
          if (topic.course!) this.courses.push(topic.course!)

        console.log(this.courses)

      }
    })

  }


  onCourseClick(course: CourseDto) {
    console.log(course);
    this.courseService.getCourse(course.id!).subscribe({
      next: (res) => {
        this.selectedCourse = res.data;
        this.selectedCourseId = course.id!;
        console.log(this.selectedCourse);
      },
    });
  }

  goBack() {
    this.router.navigate(['/home'])
  }



}
