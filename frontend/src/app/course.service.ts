import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private readonly http: HttpClient) {

  }
  addFile(courseId: number, file_id: string) {
    return this.http.get(`http://localhost:3000/courses/${courseId}/${file_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')!
      },
    })
  }

  getCourse(id: string) {
    return this.http.get(`http://localhost:3000/courses/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')!
      }
    });
  }
}
