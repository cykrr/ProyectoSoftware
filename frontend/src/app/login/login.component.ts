import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { EmptyError, catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    console.log("Login Component");
  }


  showLoading = false

  loginForm = this.formBuilder.group({
    rut: new FormControl('', Validators.required), // RutFormControl
    password: new FormControl('', Validators.required) // PasswordFormControl
  })

  onSubmit() {
    let message = ""
    console.log("submit")
    if (this.loginForm.controls.rut.errors)
      message += "Por favor ingrese un rut\n"
    if (this.loginForm.controls.password.errors)
      message += "Por favor ingrese su contraseña\n"
    if ( message != "") {
      alert(message)
      return
    }

    this.showLoading = true

    const response = this.loginService.login(this.loginForm.value.rut!, this.loginForm.value.password!)
    response.subscribe({
      error: (err) => {
        this.showLoading = false
        console.log(err)
        alert(err)
      },
      next: (res) => {
        if (res?.success) {
          console.log("Inicio de sesión exitoso")
          console.log(res.data)
          localStorage.setItem('token', res.data.token!)
          localStorage.setItem('uid', res.data.uid!)
          this.router.navigate(['/home'])
        } else {
          this.showLoading = false
          setTimeout(() => { alert(res?.message) }, 100)
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
