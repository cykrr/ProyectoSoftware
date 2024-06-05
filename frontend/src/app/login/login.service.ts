import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, defaultIfEmpty, map, throwError } from 'rxjs'
import { LoginResponseDto } from '../dtos/response.dto';
import { handleLoginError } from '../common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  host = "http://localhost:3000/"

  constructor(private http: HttpClient) {}
  login(rut: string, password: string): Observable<LoginResponseDto|null> {
    try {
      return this.http.post(`${this.host}login`, {
        "rut": rut,
        "password": password
      }).pipe(catchError(handleLoginError), map((res): any => res))
    } catch (e) {
      console.log(e);
      return EMPTY.pipe(defaultIfEmpty(null));
    }
  }
}
