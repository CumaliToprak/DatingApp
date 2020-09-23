import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';  //imported for the http request.
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //Ngx Bootstrap kullanırken bazı fonksionaliteler için gerekli.
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

//node_modules'den gelen importları yukarı localden gelen importları aşağıya yazarız. Sadece tertip ve düzen için. Zorunlu değil.

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';

@NgModule({
  declarations: [				
    AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule, //imported for the http request.
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot()
  ],
  providers: [
    AuthService, //yeni bir servis oluşturduğumuzda buraya eklemeliyiz. Böylece diğer componentlere inject edilmeye hazır olur.
    ErrorInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
