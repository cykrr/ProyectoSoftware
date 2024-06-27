import { Component } from '@angular/core';
import { CommonModule, Location, NgClass, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GradeModule } from '../../grade/grade.module';
import { GradeService } from '../../grade/grade.service';
import { UserService } from '../../user/user.service';
import { UserInfoDto } from '../../dtos/user_info.dto';
import { GradeDto, TopicDto } from '../../dtos/grade.dto';
import { FilesService } from '../../files.service';
import { CourseService } from '../../course.service';
import { UnidadDto } from '../../dtos/unidad.dto';
import { TopicService } from '../../topic.service';
import { AddFileComponent } from '../add-file/add-file.component';
import { DocumentDto } from '../../dtos/new-file.dto';


@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [GradeModule, NgFor, ReactiveFormsModule, NgClass, CommonModule, AddFileComponent],
  providers: [GradeService, FormBuilder, UserService, CourseService],
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.css'
})
export class NewCourseComponent {
  userData: UserInfoDto | undefined;
  gradeData: GradeDto[] | undefined;
  selectedGradeId: number | undefined;
  selectedGrade: GradeDto | undefined;
  selectedTopicId: number | undefined;
  selectedTopic: TopicDto | undefined;

  attachFilesForm= this.formBuilder.group({});


  newCourseForm = this.formBuilder.group({
    name: '',
    grade: -1,
    topic: -1,
    assignedTeacher: -1,
  })
  fileUploadForm = this.formBuilder.group({
    name: '',
    file: Blob,
    unidad: 'SIN_UNIDAD',
  })
  showPopup: boolean = false;
  file: File | undefined | null;
  tmpDocs: DocumentDto[] = [];
  constructor(
    private gradeService: GradeService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    public _location: Location,
    private fileService: FilesService,
    private courseService: CourseService,
    private topicService: TopicService,

  ) {
    console.log("init")
    this.gradeService.getGrades()
      .subscribe((res) => {
        console.log(res);
        this.gradeData = res.data;
      });
    this.userService.getUserInfo().subscribe((res) => {
      this.userData = res!;
    });

  }

  onTopicChange(event: Event) {
    this.attachFilesForm.reset()
    this.selectedTopicId = Number((event.target as HTMLSelectElement).value);
    console.log(this.selectedTopicId)
    this.selectedTopic = this.selectedGrade?.topics?.find((topic) => topic.id === this.selectedTopicId);
    this.tmpDocs = [];
    for (let unidad of this.selectedTopic?.unidades!) {
      for (let file of unidad.documents!) {
        this.attachFilesForm.addControl(`checkbox-file.${file.fileid}`, this.formBuilder.control(false));
      }
    }

    console.log(this.selectedTopic)
  }

  shouldReload() {
    console.log("should reload")
  }


  onFileUploadButtonClick() {
    this.showPopup = true;
  }


  updateCourseFiles(courseId: number) {
    // const selectedCourses = Object.keys(this.attachFilesForm.value).filter((key) => this.attachFilesForm.value[key]);
  }

  onFileUploadSuccess(filedto: DocumentDto) {
    console.log("NewCourse Upload success")
    this.attachFilesForm.addControl(`checkbox-file.${filedto.fileid}`, this.formBuilder.control(false));

    this.gradeService.getGrades().subscribe((res) => {
      this.gradeData = res.data;
      this.selectedGrade = this.gradeData?.find((grade) => grade.id === this.selectedGradeId);
      this.selectedTopic = this.selectedGrade?.topics?.find((topic) => topic.id === this.selectedTopicId);
      console.log(this.gradeData)
    });


  }

  // Finalizar
  // newCourseFormSubmit
  onFormSubmit() {
    console.log('Form submitted');
    if (this.newCourseForm.value.name == '') {
      alert('Por favor ingrese un nombre');
      return;
    }
    if (this.selectedGrade === undefined) {
      alert('Por favor elija un curso');
      return;
    }
    if (this.newCourseForm.value.topic == -1) {
      alert('Por favor elija una materia');
      return;
    }
    const attachFiles: { documents: string[] } = { documents: [] }
    console.log("XXXXXXXXXX")
    console.log(this.attachFilesForm['value'])
    const theForm: any = this.attachFilesForm['value']
    Object.keys(theForm).forEach((key, value) => {
      const v = theForm[key]
      console.log(key + ", " + v)
      if (v)
        attachFiles.documents.push(key.split('.')[1])
    });
    console.log("XXXXXXXXXX")

    // console.log(this.newCourseForm.value)
    // console.log(this.attachFilesForm.value)
    // Create the course in the backend
    console.log("[NewCourseComponent] Creando curso")
    this.gradeService.createCourse(
      this.newCourseForm.value.name!,
      this.newCourseForm.value.grade!,
      this.newCourseForm.value.topic!,
      attachFiles
    ).subscribe((res) => {
      if (res.success) {
        // if succeed
        this.attachFilesForm.reset()
        // console.log('Course created');
        // this.updateCourseFiles()
        this.router.navigate(['/home']);
        // go back to home

      } else {
        if (!res.success) {
          alert(res.message);
          // this.router.navigate(['/login'])
        }
        // console.log(res.data)
      }
      // this.router.navigate(['/home']);
    });
  }

  onGradeChange($event: Event) {
    this.selectedGradeId = Number(($event.target as HTMLSelectElement).value);
    this.selectedGrade = this.gradeData?.find((grade) => grade.id === this.selectedGradeId);
    // console.log(this.selectedGrade);
  }
}
