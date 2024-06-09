import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfoDto } from '../dtos/user_info.dto';
import { EMPTY, Observable, defaultIfEmpty, empty, map } from 'rxjs';
import { apiUrl } from '../enviroment';
import { ResponseDto } from '../dtos/response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo():
   Observable<UserInfoDto|null> {
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    if (!uid || !token) {
      console.log("[UserService] No token or uid found.")
      return EMPTY.pipe(defaultIfEmpty(null));
    }
    return this.http.get<UserInfoDto>(`${apiUrl}/user/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getTeacherData(uid: string, token: string):
   Observable<ResponseDto<UserInfoDto>> {
      return this.http.get<ResponseDto<UserInfoDto>>(`${apiUrl}/user/teacher`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
  }
}
