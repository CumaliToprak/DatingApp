import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//Bu bir servis classı olmamasına rağmen servis folderının içerisinde yazmamızın sebebi bu koyacak doğru yerin burası olması.

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  //HttpInterceptor Api tarafından gelen hataları tanıyacak ve yakalayacak
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //throw new Error('Method not implemented.'); 'ı sildik.
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return throwError(error.statusText); //angular componente fırlatılır.
        }
        if (error instanceof HttpErrorResponse) {
          //this condition takes care of 500 error(internal error)
          const applicationError = error.headers.get('Application-Error'); //Application-Error isimli headera sahip internal server errorı çeker.
          if (applicationError) {
            return throwError(applicationError);
          }

          const serverError = error.error;
          let modalStateErrors = ''; //email, password dosent provide requirements örn: parola 3 haneden buyuk olmalı.
          if (serverError.errors && typeof serverError.errors === 'object') {
            //serverError.errors obje ise loop ile içerisini gezip elemanları kullancaz
            for (const key in serverError.errors) {
              if (serverError.errors[key]) {
                modalStateErrors += serverError.errors[key] + '\n';
              }
            }
          }
          return throwError(modalStateErrors || serverError || 'server error'); //modalStateError boş ise serverErroru gönderir. burda serverError===error.error 'a eşittir. o da 'username already exists' 'e denk gelir diyebiliriz.
          //Hiçbiri değilse 'server error' mesajlı exception atar. Sonradan gelip bu errorun ne olduğunu anlamaya çalışırız.
          //serverError=error.error -> username already exists. : Sadece string mesaj olan error.
        }
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true, // HTTP_INTERCEPTORS can have many interceptor.
};
