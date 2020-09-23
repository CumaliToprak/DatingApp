import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//Bu class angular cli tarafından oluşturulduğundan şablon tamamlanmamıştır. oninit, constructor ve gerekli kütüphaneleri biz ekleyeceğiz. tokendan username'i çekmek için.

export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  constructor(private authService: AuthService) {
    
  }
  ngOnInit(){
    const token = localStorage.getItem('token');
    if(token){
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    
  }

}
