import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AccesTokenModel } from '../models/acces-token-model';
import { DeleteAccessToken, SetAccessToken } from '../actions/acces-token-action';

@State<AccesTokenModel>({
  name: 'accesToken',
  defaults: {
    accessToken: undefined
  }
})
export class AccesTokenState {

  @Selector()
  static getAccessToken(state: AccesTokenModel): String | undefined {
    return state.accessToken;
  }

  @Action(SetAccessToken)
  setAccessToken(ctx: StateContext<AccesTokenModel>, action: SetAccessToken) {
    ctx.patchState({ accessToken: action.accesToken });
  }

  @Action(DeleteAccessToken)
  deleteAccessToken(
    { patchState }: StateContext<AccesTokenModel>,
    { }: DeleteAccessToken
  ) {
    patchState({
      accessToken: undefined
    });
  }
}
