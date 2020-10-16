import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;
  //injection AuthService to this component:
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router //login ve logout olduktan sonra specific pagelere redirect olmak için bu servisi import ederiz.
  ) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        //to returning value is observable, we must always subscribe to observable.
        this.alertify.success('Logged in successfully'); //parameters of the subscribe method is completely optional.
      },
      (error) => {
      this.alertify.error(error);
      },
      () =>{
        //login olduktan sonra: redirect to members
        this.router.navigate(['/members']); //bunu hemen login olduktan sonra ilk parametrenin içinde de yapabilirdik. Fakat bu (complete) kısmında yapmak daha güzel.
      }
    );
  }

  loggedIn() {
    // const token = localStorage.getItem('token'); //local storagedan keyi token olan tokenı getirir.
    // return !!token; // if token empty ise false, dolu ise true döndürür.
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token'); // tokenı local storagedan atmak için.
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('logged out');
    this.router.navigate(['home']); // logout olduktan sonra: redirect to home
  }
}
