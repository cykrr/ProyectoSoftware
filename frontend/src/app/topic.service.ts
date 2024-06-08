import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnidadDto } from './dtos/unidad.dto';
import { ResponseDto } from './dtos/response.dto';
import { TopicDto } from './dtos/grade.dto';
import { Observable } from 'rxjs';
import { apiUrl } from './enviroment';
import { DocumentDto } from './dtos/new-file.dto';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  headers = {
          // 'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
  }

  url = `${apiUrl}/topics`;
  constructor(private http: HttpClient) {
  }

  obtenerUnidad(idTopic: number, idUnidad: number): Observable<ResponseDto<UnidadDto>> {
    return this.http.get<ResponseDto<UnidadDto>>(`${this.url}/${idTopic}/unidades/${idUnidad}`,
      {
        headers: this.headers
      });
  }

  cargarArchivo(fileForm: FormData): Observable<ResponseDto<DocumentDto>> {
      const idTopic = fileForm.get('idTopic');
      const idUnidad = fileForm.get('idUnidad');
      return this.http.post<ResponseDto<DocumentDto>>(`${this.url}/${idTopic}/unidades/${idUnidad}/cargar`,
        fileForm, {
          headers: this.headers
      });
  }

  createUnidad(topicId: number, unidad: UnidadDto): Observable<ResponseDto<TopicDto>> {
    return this.http.post<ResponseDto<TopicDto>>(`${this.url}/${topicId}/createUnidad/`, unidad, {
      headers: this.headers
    });
  }
}
