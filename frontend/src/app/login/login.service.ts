import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, defaultIfEmpty, map, throwError } from 'rxjs'
import { ResponseDto } from '../dtos/response.dto';
import { handleLoginError } from '../common';
import { apiUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {}
  login(rut: string, password: string): Observable<ResponseDto<{uid: string; token: string}>|null> {
    try {
      return this.http.post(`${apiUrl}login`, {
        'rut': rut,
        'password': password,
      }).pipe(catchError(handleLoginError), map((res): any => res))
    } catch (e) {
      console.log(e);
      return EMPTY.pipe(defaultIfEmpty(null));
    }
  }
}
