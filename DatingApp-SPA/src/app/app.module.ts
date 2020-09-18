import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';  //imported for the http request.

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

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
    FormsModule
  ],
  providers: [
    AuthService //yeni bir servis oluşturduğumuzda buraya eklemeliyiz. Böylece diğer componentlere inject edilmeye hazır olur.
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
