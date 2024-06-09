import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseDto } from './dtos/course.dto';
import { apiUrl } from './enviroment';
import { ResponseDto } from './dtos/response.dto';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private readonly http: HttpClient) {

  }
  addFile(courseId: number, file_id: string) {
    return this.http.get(`${apiUrl}/courses/${courseId}/${file_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')!
      },
    })
  }

  getCourse(id: number) {
    return this.http.get<ResponseDto<CourseDto>>(`${apiUrl}/courses/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')!
      }
    });
  }
}
