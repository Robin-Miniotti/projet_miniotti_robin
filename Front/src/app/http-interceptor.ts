import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetAccessToken } from '../shared/actions/acces-token-action';
import { AccesTokenState } from '../shared/states/acces-token-state';

@Injectable()
export class ApiHttpInterceptor implements HttpInterceptor {
  
  constructor(private store: Store) {}
  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    console.log('🚀 INTERCEPTOR APPELÉ pour:', req.url);

    // Récupérer le token depuis le store NGXS
    let jwtToken = this.store.selectSnapshot(AccesTokenState.getAccessToken);
    
    // Convertir en string si nécessaire
    if (jwtToken && typeof jwtToken === 'object') {
      jwtToken = String(jwtToken);
    }

    console.log('🔑 Interceptor - Token actuel depuis le store:', jwtToken);
    console.log('🔑 Interceptor - Type du token:', typeof jwtToken);
    console.log('📤 Interceptor - URL de la requête:', req.url);

    // Si un token existe, l'ajouter au header Authorization
    if (jwtToken && jwtToken !== '' && jwtToken !== 'undefined') {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${jwtToken}` },
      });
      console.log('✅ Bearer ajouté à la requête : ' + jwtToken);
    } else {
      console.warn('⚠️ Pas de token à ajouter à la requête - Token value:', jwtToken);
    }

    // Traiter la réponse pour extraire le token du header
    return next.handle(req).pipe(
      tap((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          let enteteAuthorization = evt.headers.get('Authorization');
          
          if (enteteAuthorization != null) {
            const parts = enteteAuthorization.split(/Bearer\s+(.*)$/i);
            if (parts.length > 1) {
              const newToken = parts[1];
              console.log('Bearer récupéré du header : ' + newToken);
              // Stocker le token dans le store NGXS
              this.store.dispatch(new SetAccessToken(newToken));
            }
          }
        }
      })
    );
  }
}
