import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'; //to use map()

@Injectable({ //Bir şeyleri servisimize eklememizi sağlar. Componentlerde injectable decoretor görünmemesinin sebebi onlar default olarak injectable.
  providedIn: 'root' // providedIn: servisimize ve componentlere bu servisin hangi module tarafından sağlandığını söyler. ( burda ->app.module.ts)
})
export class AuthService {
//_servise -> alt çizgiyle başlamamızın sebebi app folderin en ustune gelmesi için bu klasörün. Özel bir sebebi yok.
//servisler component değildir.

baseurl = 'http://localhost:5000/api/auth/';

constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseurl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if( user) {
          localStorage.setItem('token', user.token); //localde saklıyoruz. browser dev toolda Storage kısmında login yaptıktan sonra gönderilen tokenı görebiliriz.
        }
      })
    );
  }

  register(model: any){
    return this.http.post(this.baseurl+'register', model); // registerda token almaya gerek olmadığından daha basit.
  }

}
