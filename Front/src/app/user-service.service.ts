import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from './models/user';
import { LoginResponse, DeleteResponse } from './models/api-responses';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthConnexion, AuthDeconnexion } from '../shared/actions/auth-action';
import { DeleteAccessToken, SetAccessToken } from '../shared/actions/acces-token-action';
import { AuthState } from '../shared/states/auth-state';
import { AccesTokenState } from '../shared/states/acces-token-state';

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

  deleteUser(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(environment.apiUrl + "/utilisateur/" + id);
  }

  login(login: string, pass: string): Observable<HttpResponse<LoginResponse>> {
    return this.http.post<LoginResponse>(environment.apiUrl + "/utilisateur/login", { login, pass }, { observe: 'response' }).pipe(
      tap((response) => {
        // Récupérer le token depuis le header Authorization
        const authHeader = response.headers.get('Authorization');
        
        if (authHeader) {
          // Extraire le token du format "Bearer xxx"
          const token = authHeader.replace(/^Bearer\s+/, '');
          // Stocker le token dans le store NGXS
          this.store.dispatch(new SetAccessToken(token));
        }
        
        // L'API retourne le user dans le body
        const user = response.body;
        
        // Stocker l'utilisateur dans le store NGXS si présent
        if (user) {
          this.store.dispatch(new AuthConnexion(user));
        }
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
