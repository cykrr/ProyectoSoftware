import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfoDto } from '../dtos/user_info.dto';
import { EMPTY, Observable, defaultIfEmpty, empty, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:3000/"

  constructor(private http: HttpClient) { }

  getUserInfo():
   Observable<UserInfoDto|null> {
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    if (!uid || !token) {
      console.log("[UserService] No token or uid found.")
      return EMPTY.pipe(defaultIfEmpty(null));
    }
    console.log(uid)
    return this.http.get(`${this.url}user/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      defaultIfEmpty(null),
      map((res): any => res)
    )
  }

  getTeacherData(uid: string, token: string):
   Observable<UserInfoDto> {
    try {
      return this.http.get(`${this.url}user/teacher`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).pipe(map((res): any => res))
    } catch (e) {
      console.log(e);
      return new Observable<UserInfoDto>();
    }
  }

}
