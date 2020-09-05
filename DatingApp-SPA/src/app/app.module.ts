import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';  //imported for the http request.

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component'; //this is added automatically when we add this component to our project.

@NgModule({
  declarations: [	
    AppComponent,
      ValueComponent //this is added automatically when we add this component to our project.
   ],
  imports: [
    BrowserModule,
    HttpClientModule //imported for the http request.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
