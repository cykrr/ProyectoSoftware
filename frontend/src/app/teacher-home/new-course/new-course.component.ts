import { Component } from '@angular/core';
import { CommonModule, Location, NgClass, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GradeModule } from '../../grade/grade.module';
import { GradeService } from '../../grade/grade.service';
import { UserService } from '../../user/user.service';
import { UserInfoDto } from '../../dtos/user_info.dto';
import { GradeDto } from '../../dtos/grade.dto';
import { FilesService } from '../../files.service';
import { toFormData } from '../../common';
import { FileDto } from '../../dtos/file.dto';

@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [GradeModule, NgFor, ReactiveFormsModule, NgClass, CommonModule],
  providers: [GradeService, FormBuilder, UserService],
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.css'
})
export class NewCourseComponent {
  userData: UserInfoDto | undefined;
  gradeData: GradeDto[] | undefined;
  selectedGradeId: number | undefined;
  selectedGrade: GradeDto | undefined;
  tmpFiles: FileDto[] = [];

  attachFilesForm = this.formBuilder.group({})


  newCourseForm = this.formBuilder.group({
    name: '',
    grade: -1,
    topic: -1,
    assignedTeacher: -1,
  })
  fileUploadForm = this.formBuilder.group({
    name: '',
    file: Blob,
  })
  showPopup: boolean = false;
  file: File | undefined | null;
  constructor(
    private gradeService: GradeService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    public _location: Location,
    private fileService: FilesService,

  ) {
    console.log("init")
    this.gradeService.getGrades()
    .subscribe((res) => {
      console.log(res);
      this.gradeData = res;
    });
    this.userService.getUserInfo().subscribe((res) => {
      this.userData = res!;
    });

  }

  onFileChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      this.file = file;
      console.log(file)
    }
  }

  onFileUploadButtonClick() {
    this.showPopup = true;
  }

  onFileUploadFormSubmit() {
    console.log(this.fileUploadForm.value)
    const formData = new FormData();
    formData.append('file', this.file!);
    const name = this.fileUploadForm.value.name;
    formData.append('name', name != '' ? name! : this.file!.name);
    console.log(formData);
    this.fileService.uploadFile(formData).subscribe((res) => {
      if (res.success) {
        // Store the file in RAM
        this.tmpFiles.push(res.document);
        // Hide the popup
        this.showPopup = false;
        // Rebuild the formgroup
        this.attachFilesForm = this.formBuilder.group({});
        this.tmpFiles.forEach((file) => {
          this.attachFilesForm.addControl(`checkbox-file.${file.id}`, this.formBuilder.control(false));
        });
      }
    })
  }

  updateCourseFiles() {
    this.courseService.updateCourseFiles(this.selectedCourseId!, this.tmpFiles.filter((file) => this.attachFilesForm.value[`checkbox-file.${file.id}`]))
  }

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
    console.log(this.newCourseForm.value)
    console.log(this.attachFilesForm.value)
    this.gradeService.createCourse(
      this.newCourseForm.value.name!,
      this.newCourseForm.value.grade!,
      this.newCourseForm.value.topic!,
    ).subscribe((res) => {
      if(res.success) {
        console.log('Course created');
        this.updateCourseFiles()
        this.router.navigate(['/home']);
      } else {
        alert(res.message);
        console.log(res.data)
      }
      // this.router.navigate(['/home']);
    });
  }

  onGradeChange($event: Event) {
    this.selectedGradeId = Number(($event.target as HTMLSelectElement).value);
    this.selectedGrade = this.gradeData?.find((grade) => grade.id === this.selectedGradeId);
    console.log(this.selectedGrade);
  }
}
