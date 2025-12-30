import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { routes } from './app.routes';
import { FavorisState } from './favoris/favoris.state';
import { AccesTokenState } from '../shared/states/acces-token-state';
import { AuthState } from '../shared/states/auth-state';
import { ApiHttpInterceptor } from './http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHttpInterceptor,
      multi: true
    },
    importProvidersFrom(
      NgxsModule.forRoot([FavorisState, AccesTokenState, AuthState], {
        developmentMode: true
      }),
      NgxsStoragePluginModule.forRoot({
        keys: ['favoris', 'accesToken', 'auth']
      })
    )
  ]
};
