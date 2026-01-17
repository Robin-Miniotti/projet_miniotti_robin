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

    // Récupérer le token depuis le store NGXS
    let jwtToken = this.store.selectSnapshot(AccesTokenState.getAccessToken);
    
    // Convertir en string si nécessaire
    if (jwtToken && typeof jwtToken === 'object') {
      jwtToken = String(jwtToken);
    }

    // Si un token existe, l'ajouter au header Authorization
    if (jwtToken && jwtToken !== '' && jwtToken !== 'undefined') {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${jwtToken}` },
      });
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
              // Stocker le token dans le store NGXS
              this.store.dispatch(new SetAccessToken(newToken));
            }
          }
        }
      })
    );
  }
}
