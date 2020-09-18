import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
model: any = {}
  //parentten gönderilen properyi almak için aşağıdaki komut yazılır. Parentten childe gönderildiği için buna 'input property' de denir.
  @Input() valuesFromHome: any; //property ismi gönderilen propery ile aynı olmalı! Şimdi bu propertyi html içerisinde kullanabilirim.
  @Output() cancelRegister = new EventEmitter(); //child to parent property. We also called this as 'output property'

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  register(){
    this.authService.register(this.model).subscribe(() => { //register metod observable döndürdüğün subscribe olmalıyız.
      console.log('Registiration is successfull');
    }, error => {
      console.log(error);
    });
  }

  cancel(){
    this.cancelRegister.emit(false); // emit parametre olarak her veri tipi alabilir. Obje de gönderebiliriz parent componente.
  }

}
