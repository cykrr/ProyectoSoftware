import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { EmptyError, catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {}



  loginForm = this.formBuilder.group({
    rut: '',
    password: ''
  })

  onSubmit() {
    // console.log("submit")
    const response = this.loginService.login(this.loginForm.value.rut!, this.loginForm.value.password!)
    response.subscribe({
      error: (err) => {
        console.log(err)
        alert(err)
      },
      next: (res) => {
        if (res?.success) {
          localStorage.setItem('token', res.data.token!)
          localStorage.setItem('uid', res.data.uid!)
          this.router.navigate(['/home'])
        } else {
          alert(res?.message)
        }
      }

    });
    // response.subscribe((res)=>{
    //   console.log("subd")
    //   if (res?.success) {
    //     localStorage.setItem('token', res.token!)
    //     localStorage.setItem('uid', res.uid!)
    //     this.router.navigate(['/home'])
    //   } else {
    //     alert(res?.message)
    //   }
    // }, (err) => {
    //   console.log(err)
    //   alert(err)
    // })
  }

}
