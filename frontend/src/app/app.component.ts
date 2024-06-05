import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login/login.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from './user/user.service';
import { GradeModule } from './grade/grade.module';
import { GradeService } from './grade/grade.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, HttpClientModule, GradeModule ],
  providers: [LoginService, UserService, GradeService],
  templateUrl: './app.component.html',

  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProyectoSoftware';
  constructor(
  ) {}

}
