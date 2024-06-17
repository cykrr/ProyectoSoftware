import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GradeDto } from '../dtos/grade.dto';
import { ResponseDto } from '../dtos/response.dto';
import { apiUrl } from '../enviroment';

class Response<T> {
  success: boolean | undefined;
  message: string | undefined;
  data: T | undefined;
  course: any;
}

class CourseDto {
  name: string | undefined;
  grade: number | undefined;
  topic: number | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  constructor(private http: HttpClient) { }

  getGrades(): Observable<ResponseDto<GradeDto[]>> {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    return this.http.get<ResponseDto<GradeDto[]>>(`${apiUrl}/grades`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
  createCourse(name: string, grade: number, topic: number, attachFilesForm: object): Observable<ResponseDto<CourseDto>> {
    const token = localStorage.getItem('token');
    const uid = Number.parseInt(localStorage.getItem('uid')!);
    return this.http.post(`${apiUrl}/courses/`, {
      //SendCreateCourseDto
      name,
      gradeId: grade,
      topicId: topic,
      assignedTeacherId: uid,
      attachFilesForm
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(map((res): any => res))
  }
}
