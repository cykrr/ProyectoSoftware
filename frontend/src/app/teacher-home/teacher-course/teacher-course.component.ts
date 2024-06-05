import { Component, Input } from '@angular/core';
import { CourseDto } from '../../dtos/course.dto';

@Component({
  selector: 'app-teacher-course',
  standalone: true,
  imports: [],
  templateUrl: './teacher-course.component.html',
  styleUrl: './teacher-course.component.css'
})
export class TeacherCourseComponent {
  @Input() course: CourseDto|undefined;

  constructor() {

  }

}
