import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function handleLoginError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error("Error de conexión.");
    } else {
      console.error(`El servidor retornó ${error.status} con el mensaje:  ${error.error}.`)
    }
    return throwError(()=> "Ocurrió un problema. Inténtelo de nuevo más tarde.")

  }

export function toFormData<T extends object>(formValue: T) {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value = (formValue as any)[key];
    formData.append(key, value);
  }

  return formData;
}
