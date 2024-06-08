import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    userData: object | undefined;
    constructor(
      private router: Router,
      private userService: UserService
    ) {
      // console.log("home component")
      this.userService.getUserInfo()
      .subscribe((res) => {
        console.log(res)
        this.userData = res!;
        if (res?.role === 'Teacher') {
          this.router.navigate(['/home/teacher'])
        } else if (res?.role === 'Student') {
          this.router.navigate(['/home/student'])
        }
      })


    }
}
