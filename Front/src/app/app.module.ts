import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { PollutionsModule } from './pollutions/pollutions.module';
import { UserModule } from './user/user.module';
import { FavorisState } from './favoris/favoris.state';

export const appConfig = [
  importProvidersFrom(
    NgxsModule.forRoot([FavorisState]),
    NgxsStoragePluginModule.forRoot({
      keys: ['favoris']
    }),
    PollutionsModule,
    UserModule
  ),
  provideRouter([])
];
