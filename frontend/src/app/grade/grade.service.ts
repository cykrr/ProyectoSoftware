import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GradeDto } from '../dtos/grade.dto';

class Response<T> {
  success: boolean | undefined;
  message: string | undefined;
  data: T | undefined;
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
  private url = "http://localhost:3000"
  constructor(private http: HttpClient) { }

  getGrades(): Observable<GradeDto[]> {
    console.log('getGrades');
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    return this.http.get('/api/grades', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(map((res): any => res))
  }
  createCourse(name: string, grade: number, topic: number): Observable<Response<CourseDto>> {
    const token = localStorage.getItem('token');
    const uid = Number.parseInt(localStorage.getItem('uid')!);
    return this.http.post(`/api/courses/`, {
      name,
      gradeId: grade,
      topicId: topic,
      assignedTeacherId: uid
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(map((res): any => res))
  }
}
