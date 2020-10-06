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
}
