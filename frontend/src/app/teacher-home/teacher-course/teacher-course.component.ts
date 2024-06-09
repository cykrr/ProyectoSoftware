import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CourseDto } from '../../dtos/course.dto';
import { CommonModule } from '@angular/common';
import { UnidadDto } from '../../dtos/unidad.dto';
import { apiUrl } from '../../enviroment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faFilePdf, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { AddFileComponent } from '../add-file/add-file.component';
import { DocumentDto } from '../../dtos/new-file.dto';
import { Router } from '@angular/router';


@Component({
  selector: 'app-teacher-course',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, AddFileComponent],
  templateUrl: './teacher-course.component.html',
  styleUrl: './teacher-course.component.css'
})
export class TeacherCourseComponent {
  @Input() course: CourseDto|undefined;
  @Output() shouldReload: EventEmitter<boolean> = new EventEmitter();
  apiUrl: string = apiUrl;
  faEdit = faEdit
  faFilePdf = faFilePdf
  faAngleRight = faAngleRight
  showAddContent: boolean = false;
  constructor(private router: Router) {
    if (!this.course?.documents) return
  }

  ngOnChanges() {
    console.log(this.course!)
  }


  onFileUploadSuccess(file: DocumentDto) {
    console.log("File upload success")
    console.log(this.course!.documents)
    this.shouldReload.emit(true);
    console.log (file)
  }
}
