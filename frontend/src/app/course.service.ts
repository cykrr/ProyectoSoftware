import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseDto, DayDto, EventDto } from './dtos/course.dto';
import { apiUrl } from './enviroment';
import { ResponseDto } from './dtos/response.dto';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private readonly http: HttpClient) {}

  editActivity(id: number, form: { id: number|null|undefined, name: string|null|undefined, description: string|null|undefined, date: string|null|undefined }) {
    return this.http.post<ResponseDto<EventDto>>(`${apiUrl}/courses/${id}/calendar/edit_entry`, form, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')!
      }
    });
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
  addCalendarEntry(id: number, form: { date: string|null|undefined, name: string|null|undefined, description: string|null|undefined}) {
    return this.http.post<ResponseDto<DayDto>>(`${apiUrl}/courses/${id}/calendar/add_entry`, form, {
      headers: {
      }
    });
  }
}
