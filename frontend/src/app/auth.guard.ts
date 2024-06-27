import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { UserService } from './user/user.service';
import { EmptyError, lastValueFrom, map } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  console.log("[AuthGuard]")
  console.log("Getting user info..")
  const uinfo = await lastValueFrom(userService.getUserInfo())
  console.log(uinfo)
  if (!uinfo) {
    console.log("[LoginGuard] Redirecting to /login")
    return router.createUrlTree(['/login']);
  }
  console.log("ok")
  return true;

  // const uinfo = await lastValueFrom(userService.getUserInfo())
  // if (!uinfo) {
  //   alert("err")
  // }
  // if (uinfo) {
  //   console.log("ok")
  //   return true;
  // } else {
  //   console.log("[LoginGuard] Redirecting to /login")
  //   return router.createUrlTree(['/login']);
  // }


};

// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { UserService } from './user/user.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard {

//   constructor(
//     private router: Router,
//     private userService: UserService
//   ) { }

//   canActivate(): boolean {
//     const token = localStorage.getItem('token');
//     const user = this.userService.getUserInfo(localStorage.getItem('uid')!, token!);
//     // TODO: Check if token is valid
//     if (!token) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     return true;
//   }
// }
