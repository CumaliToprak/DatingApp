import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'; //angular web token servisini kullanmak için.
import { map } from 'rxjs/operators'; //to use map()
import { environment } from 'src/environments/environment';

@Injectable({ //Bir şeyleri servisimize eklememizi sağlar. Componentlerde injectable decoretor görünmemesinin sebebi onlar default olarak injectable.
  providedIn: 'root' // providedIn: servisimize ve componentlere bu servisin hangi module tarafından sağlandığını söyler. ( burda ->app.module.ts)
})
export class AuthService {
//_servise -> alt çizgiyle başlamamızın sebebi app folderin en ustune gelmesi için bu klasörün. Özel bir sebebi yok.
//servisler component değildir.

baseurl = environment.apiUrl+'auth/';
jwtHelper = new JwtHelperService();
decodedToken : any;

constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseurl + 'login', model).pipe(
      map((response: any) => {
        
        const user = response;
        console.log(user);
        if( user) {
          localStorage.setItem('token', user.token); //localde saklıyoruz. browser dev toolda Storage kısmında login yaptıktan sonra gönderilen tokenı görebiliriz.
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
        }
      })
    );
  }

  register(model: any){
    return this.http.post(this.baseurl+'register', model); // registerda token almaya gerek olmadığından daha basit.
  }

  loggedIn(){
    const token = localStorage.getItem('token'); 
    return !this.jwtHelper.isTokenExpired(token);//token kullanımda mı? token var mı? veya tokenla ilgili başka bir problem mi var. Boolean değer döndürür. Tersini almamızın sebebi eğer kullanımda ise false döndürür, biz de tersini alırız.
    // jwthelper ile istokenExpired diye kontrol etmek daha önce token var mı? kontrolünden daha sağlıklı bir kod biçimiidr.
    //ama bu app güvenligi ile ilgi bir sey degistirmez. Daha ince de client bizim token keyimizi öğrenemezdi. Çünkü yollamıyoruz api'dan.
  }

}
