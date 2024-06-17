import { Routes } from '@angular/router';
import {  authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { HomeComponent } from './home/home.component';
import { NewCourseComponent } from './teacher-home/new-course/new-course.component';
import { TeacherCourseComponent } from './teacher-home/teacher-course/teacher-course.component';
import { TeacherCalendarComponent } from './teacher-home/teacher-calendar/teacher-calendar.component';
import { StudentCourseComponent } from './student-course/student-course.component';
import { EntryComponent } from './entry/entry.component';
import { StudentCalendarComponent } from './student-course/student-calendar/student-calendar.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: EntryComponent},
  { path: 'home', canActivate: [authGuard], component:  HomeComponent},
  { path: 'home/teacher/new-course', canActivate: [authGuard], component:  NewCourseComponent},
  { path: 'home/teacher/courses/:courseId', canActivate: [authGuard], component:  TeacherCourseComponent},
  { path: 'home/teacher/courses/:courseId/calendar', canActivate: [authGuard], component:  TeacherCalendarComponent},
  { path: 'home/student/courses/:courseId', canActivate: [authGuard], component:  StudentCourseComponent},
  { path: 'home/student/courses/:courseId/calendar', canActivate: [authGuard], component:  StudentCalendarComponent},
  { path: 'login', component: LoginComponent },

];
