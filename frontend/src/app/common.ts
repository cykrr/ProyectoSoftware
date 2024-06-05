import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function handleLoginError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error("Connection error");
    } else {
      console.error(`Backend returned ${error.status} with message ${error.error}`)
    }
    return throwError(()=> "Something bad happened; please try again later.")

  }

export function toFormData<T extends object>(formValue: T) {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value = (formValue as any)[key];
    formData.append(key, value);
  }

  return formData;
}
