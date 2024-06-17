import { Component } from '@angular/core';
import { apiUrl } from '../enviroment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


function handleConnectionError(err: Error) {
  console.error(err)
  alert("Ocurrió un error al establecer la conexión con el servidor.")

}

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css'
})
export class EntryComponent {
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get(apiUrl, {responseType: 'text'}).subscribe({
      next: data => this.handleConnectionSuccess(data),
      error: err => handleConnectionError(err)
    })

  }

  handleConnectionSuccess(data: string) {
    this.router.navigate(['/home'])
  }
}
