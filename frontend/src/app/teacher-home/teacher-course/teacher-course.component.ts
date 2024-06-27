import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CourseDto } from '../../dtos/course.dto';
import { CommonModule } from '@angular/common';
import { UnidadDto } from '../../dtos/unidad.dto';
import { apiUrl } from '../../enviroment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faFilePdf, faAngleRight, faXmark, faEllipsisVertical, faEllipsis, faRightFromBracket, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AddFileComponent } from '../add-file/add-file.component';
import { DocumentDto } from '../../dtos/new-file.dto';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { UserInfoDto } from '../../dtos/user_info.dto';
import { UserService } from '../../user/user.service';
import { CourseService } from '../../course.service';
import { lastValueFrom } from 'rxjs';
import { logOff } from '../../common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-teacher-course',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, AddFileComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './teacher-course.component.html',
  styleUrl: './teacher-course.component.css'
})
export class TeacherCourseComponent {
  @Input() course: CourseDto|undefined;
  @Output() shouldReload: EventEmitter<boolean> = new EventEmitter();

  logOff = logOff;
  faTrash = faTrash

  teacher: UserInfoDto | undefined;

  apiUrl: string = apiUrl;
  faEdit = faEdit
  faFilePdf = faFilePdf
  faAngleRight = faAngleRight
  faXmark = faXmark
  faRightFromBracket = faRightFromBracket
  showAddContent: boolean = false;
  showEditContent: boolean = false;


  editFileForm: FormGroup = new FormGroup({
    id: new FormControl(-1, Validators.required),
    name: new FormControl('non', Validators.required),
  });

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


  sendNotification() {
    const url = "https://mail.google.com/mail/u/0/?fs=1&bcc="
    const urlend = "&tf=cm"
    let studentList = '';
    for (let student of this.selectedCourse!.topic!.grade!.students!) {
      studentList += student.mail + ';';
    }
    window.open(url + studentList + urlend, '_blank')
  }

  onEditFileClick(file: DocumentDto) {
    this.editFileForm.controls['id'].setValue(file.id);
    this.editFileForm.controls['name'].setValue(file.name);
    this.showEditContent = true;
  }

  onEditFileFormSubmit() {
    if (!this.editFileForm.valid) {
      console.log(this.editFileForm.controls['name'].errors)
      alert('Por favor ingrese un nombre');
      return
    }
    console.log("Editing file", this.selectedCourse?.id, this.editFileForm.value)
    this.courseService.editFile(this.selectedCourse!.id!, this.editFileForm.value).subscribe({
      next: (res) => {
        console.log(res)
        if (!res.success) {
          alert(res.message)
        } else {
          this.showEditContent = false;
          alert("Archivo editado exitosamente")
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
        }
      },
      error: (err) => {
        alert("Error editando archivo")
        console.log(err)
      }
    })
  }

  deleteFile(file: DocumentDto) {
    console.log("Deleting file", this.selectedCourse?.id, file.id)
    this.courseService.delFile(this.selectedCourse!.id!, file.id!).subscribe({
      next: (res) => {
        if (!res.success) {
          alert(res.message)
        } else {
          alert("Archivo eliminado exitosamente")
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
        }
      },
      error: (err) => {
        alert("Error eliminando archivo")
        console.log(err)
      }
    })


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
