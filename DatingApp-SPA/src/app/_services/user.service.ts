import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;  //environments => environment.ts' den çekeriz.

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users');
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id); //get metodu option alır. bu option header alabilir. headerda da yetkilendirme için token bearer bulunabilir.
  }

  updateUser(id: number, user: User){
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});  //post request olduğundan body parametre istiyor. Biz de boş obje gönderdik.
  }

  deletePhoto(userId: number, id: number){
    return this.http.delete(this.baseUrl +  'users/' + userId + '/photos/' + id );
  }
}
