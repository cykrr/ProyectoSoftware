import { Routes } from '@angular/router';
import {  authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { HomeComponent } from './home/home.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { NewCourseComponent } from './teacher-home/new-course/new-course.component';
import { TeacherCourseComponent } from './teacher-home/teacher-course/teacher-course.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', canActivate: [authGuard], component:  HomeComponent},
  { path: 'home/teacher', canActivate: [authGuard], component:  TeacherHomeComponent},
  { path: 'home/teacher/new-course', canActivate: [authGuard], component:  NewCourseComponent},
  { path: 'home/teacher/course/:courseId', canActivate: [authGuard], component:  TeacherCourseComponent},
  { path: 'home/student', canActivate: [authGuard], component:  StudentHomeComponent},
  { path: 'login', component: LoginComponent },

];
