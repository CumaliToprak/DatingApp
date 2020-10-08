//Bu dosyayı baştan biz yazdık, ve de bu dosyayı biz manuel olarak oluşturduk. Çünkü kısayoldan oluşturma seceneği yok.
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

//Bu classın amacı daha önce member detay kısmında member verilerini alırken kullandığımız safe navigation operator(?) kullanmadan dataları almak.

@Injectable()
export class MemberEditResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
      //pipe kısmı hata yakalamak için.
    return this.userService.getUser(this.authService.decodedToken.nameid).pipe(   //resolve metodunu kullandığımız için subscribe olmamıza gerek yok. O otomatik olarak olur
        catchError(error => {
            this.alertify.error('Problem retrieving your data');
            this.router.navigate(['/members']);
            return of(null); //observable olarak null döneriz.
        })
    )
  }
}
