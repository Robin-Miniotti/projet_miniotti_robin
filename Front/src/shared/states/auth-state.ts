import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthStateModel } from '../models/auth-state-model';
import { AuthConnexion, AuthDeconnexion } from '../actions/auth-action';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    utilisateur: undefined,
  },
})
@Injectable()
export class AuthState {

  @Selector()
  static isConnected(state: AuthStateModel): boolean {
    return state.utilisateur !== null && state.utilisateur !== undefined;
  }

  @Selector()
  static getConnectedUser(state: AuthStateModel) {
    return state.utilisateur;
  }

  @Action(AuthConnexion)
  connect(
    { patchState }: StateContext<AuthStateModel>,
    { payload }: AuthConnexion
  ) {
    patchState({
      utilisateur: payload
    });
  }

  @Action(AuthDeconnexion)
  deconnect(
    { patchState }: StateContext<AuthStateModel>,
    { }: AuthDeconnexion
  ) {
    patchState({
      utilisateur: undefined
    });
  }
}
