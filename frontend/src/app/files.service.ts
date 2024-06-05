import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileDto } from './dtos/file.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  host = "http://localhost:3000/"

  constructor(private http: HttpClient) { }
  getFile(file: string) {
    return this.http.get(`${this.host}file/${file}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')!,
      },
    });
  }
  uploadFile(fileForm: FormData | null): Observable<{success: boolean, document: FileDto}> {
    console.log(fileForm)
    return this.http.post<{success: boolean, document: FileDto}>(`${this.host}files`, fileForm, {
      headers: {
        'Authorization': localStorage.getItem('token')!,
      },
    });
  }
}
