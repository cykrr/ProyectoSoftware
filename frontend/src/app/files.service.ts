import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentDto, NewFileDto } from './dtos/new-file.dto';
import { Observable } from 'rxjs';
import { apiUrl } from './enviroment';
import { ResponseDto } from './dtos/response.dto';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }
  getFile(file: string) {
    return this.http.get(`${apiUrl}/files/${file}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')!,
      },
    });
  }

  // uploadFile(fileForm: FormData): Observable<{success: boolean, file: NewFileDto}> {
  //   console.log(fileForm)
  // }
}
