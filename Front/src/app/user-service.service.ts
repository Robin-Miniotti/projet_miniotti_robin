import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from './models/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthConnexion, AuthDeconnexion } from '../shared/actions/auth-action';
import { DeleteAccessToken } from '../shared/actions/acces-token-action';
import { AuthState } from '../shared/states/auth-state';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(
    private http: HttpClient,
    private store: Store
  ) { }

  getUsers() {
    return this.http.get<User[]>(environment.apiUrl + "/utilisateur");
  }

  addUser(user: User) {
    return this.http.post<User>(environment.apiUrl + "/utilisateur", user);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(environment.apiUrl + "/utilisateur/" + id);
  }

  login(login: string, pass: string) {
    return this.http.post<any>(environment.apiUrl + "/utilisateur/login", { login, pass }).pipe(
      tap((user) => {
        // Stocker l'utilisateur dans le store NGXS
        this.store.dispatch(new AuthConnexion(user));
      })
    );
  }

  logout() {
    // Supprimer l'utilisateur et le token du store
    this.store.dispatch(new AuthDeconnexion());
    this.store.dispatch(new DeleteAccessToken());
  }

  isLoggedIn(): Observable<boolean> {
    return this.store.select(AuthState.isConnected);
  }

  getConnectedUser() {
    return this.store.select(AuthState.getConnectedUser);
  }
}
