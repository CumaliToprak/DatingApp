import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  model: any = {};
    //injection AuthService to this component:
  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
   
  }


  login(){
    this.authService.login(this.model).subscribe(next => {   //to returning value is observable, we must always subscribe to observable.
      this.alertify.success('Logged in successfully');   //parameters of the subscribe method is completely optional.
    }, error => {
      this.alertify.error(error);
    })
  }

  loggedIn(){
    // const token = localStorage.getItem('token'); //local storagedan keyi token olan tokenı getirir.
    // return !!token; // if token empty ise false, dolu ise true döndürür.
    return this.authService.loggedIn();
  }

  logout(){
    localStorage.removeItem('token'); // tokenı local storagedan atmak için.
    this.alertify.message('logged out')
  }

}
