import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { UserInfoDto } from '../dtos/user_info.dto';
import { CoursePickerComponent } from './course-picker/course-picker.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CoursePickerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    userData: UserInfoDto | undefined;
    constructor(
      private router: Router,
      private userService: UserService
    ) {

    }
    ngOnInit() {
      console.log("Home Component");
      console.log("[HomeComponent] Getting user info...")
      this.userService.getUserInfo()
      .subscribe({
      next: (res) => {
        console.log(res)
        this.userData = res!;

      },
      error: (err) => {
        console.log(err);
        console.log("Something went wrong, logging out...")
        this.router.navigate(['/login'])
      }
    })
    }

}
