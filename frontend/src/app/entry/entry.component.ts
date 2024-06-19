import { Component } from '@angular/core';
import { apiUrl } from '../enviroment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserInfoDto } from '../dtos/user_info.dto';
import { UserService } from '../user/user.service';


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
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}
  userData: UserInfoDto | undefined;

  ngOnInit() {
    console.log("App Entry");

    this.http.get(apiUrl, {responseType: 'text'}).subscribe({
      next: data => this.handleConnectionSuccess(data),
      error: err => handleConnectionError(err)
    })

  }

  handleConnectionSuccess(data: string) {
    this.userService.getUserInfo().subscribe({
      next: (res) => {
        if (res!) {
          this.userData = res!;
          this.router.navigate(['/home'])
        } else {
          this.router.navigate(['/login'])
        }
      },
      error: (err) => {
        console.log(err);
        alert(err)
        this.router.navigate(['/login'])
      }
    })
  }
}
