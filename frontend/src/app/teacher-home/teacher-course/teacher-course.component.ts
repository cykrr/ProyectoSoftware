import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CourseDto } from '../../dtos/course.dto';
import { CommonModule } from '@angular/common';
import { UnidadDto } from '../../dtos/unidad.dto';
import { apiUrl } from '../../enviroment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faFilePdf, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AddFileComponent } from '../add-file/add-file.component';
import { DocumentDto } from '../../dtos/new-file.dto';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { UserInfoDto } from '../../dtos/user_info.dto';
import { UserService } from '../../user/user.service';
import { CourseService } from '../../course.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-teacher-course',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, AddFileComponent, RouterLink],
  templateUrl: './teacher-course.component.html',
  styleUrl: './teacher-course.component.css'
})
export class TeacherCourseComponent {
  @Input() course: CourseDto|undefined;
  @Output() shouldReload: EventEmitter<boolean> = new EventEmitter();

  teacher: UserInfoDto | undefined;

  apiUrl: string = apiUrl;
  faEdit = faEdit
  faFilePdf = faFilePdf
  faAngleRight = faAngleRight
  faXmark = faXmark
  showAddContent: boolean = false;

  selectedCourse: CourseDto | undefined;
  selectedCourseId: number | undefined;

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');

    console.log("Getting teacher data")
    this.userService.getTeacherData(localStorage.getItem('uid')!, localStorage.getItem('token')!).subscribe({
      next: (res) => {
        if (!res.success) {
          alert(res.message)
          this.router.navigate(['/login'])
        } else {
          console.log("Got teacher data")
          this.teacher = res.data;
        }
      }
    })

    this.selectedCourseId = courseId ? parseInt(courseId) : undefined;
    console.log("Loading Course with ID ", this.selectedCourseId)
    this.courseService.getCourse(this.selectedCourseId!).subscribe({
      next: (res) => {
        if (!res.success) {
          alert(res.message)
          this.router.navigate(['/home/teacher'])
        } else {
          this.selectedCourse = res.data;
        }
      }
    })
  }


  constructor(
    private router: Router,
    private userService: UserService,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {
  }

  goBack() { this.router.navigate(['/home/'])}

  async onCourseClick(course: any) {
    this.selectedCourseId = course.id;
    if (this.selectedCourseId !== this.selectedCourse?.id)
      this.selectedCourse = (await lastValueFrom(this.courseService.getCourse(this.selectedCourseId!))).data
  }

  ngOnChanges() {
    console.log(this.course!)
  }


  onFileUploadSuccess(file: DocumentDto) {
    console.log("File upload success")
    this.courseService.getCourse(this.selectedCourseId!).subscribe({
      next: (res) => {
        if (!res.success) {
          alert(res.message)
          this.router.navigate(['/home/teacher'])
        } else {
          this.selectedCourse = res.data;
        }
      }
    })
    this.shouldReload.emit(true);
    console.log (file)
  }
}
