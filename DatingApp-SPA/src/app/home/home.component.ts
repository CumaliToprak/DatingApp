import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
//this component will be parent component of the register component.
export class HomeComponent implements OnInit {

  registerMode = false; //kayıt olup olmadığını tutan değişken
  values: any;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.getValues();
  }

  registerToggle(){
    this.registerMode = true;
  }


  getValues(){
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.values = response;
    }, error =>{
       console.log(error);
     } );
  }

  //(child component) register componentten gelen property içerisindeki false değerini atayan metod.  
  cancelRegisterMode(registerMode: boolean){
    this.registerMode = registerMode; 
  }

}


