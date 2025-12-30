import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddFavori } from './addfavori.action';
import { RemoveFavori } from './removefavori.action';
import { ClearFavories } from './clearfavories.action';
import { FavorisStateModel } from './favoris-state-model';
import { Pollution } from '../models/pollution';

@State<FavorisStateModel>({
  name: 'favoris',
  defaults: {
    favoris: []
  }
})
@Injectable()
export class FavorisState {
  
  // Selector to get all favorites
  @Selector()
  static getFavoris(state: FavorisStateModel): Pollution[] {
    return state.favoris;
  }

  // Selector to check if a pollution is in favorites
  @Selector()
  static isFavori(state: FavorisStateModel) {
    return (pollutionId: number) => {
      return state.favoris.some(pollution => pollution.id === pollutionId);
    };
  }

  // Selector to get the count of favorites
  @Selector()
  static getFavorisCount(state: FavorisStateModel): number {
    return state.favoris.length;
  }

  // Action to add a pollution to favorites
  @Action(AddFavori)
  addFavori(ctx: StateContext<FavorisStateModel>, action: AddFavori) {
    const state = ctx.getState();
    const pollution: Pollution = action.payload;
    
    // Check if the pollution is already in favorites
    const exists = state.favoris.some(fav => fav.id === pollution.id);
    
    if (!exists) {
      ctx.patchState({
        favoris: [...state.favoris, pollution]
      });
    }
  }

  // Action to remove a pollution from favorites
  @Action(RemoveFavori)
  removeFavori(ctx: StateContext<FavorisStateModel>, action: RemoveFavori) {
    const state = ctx.getState();
    const pollutionId = action.payload;
    
    ctx.patchState({
      favoris: state.favoris.filter(pollution => pollution.id !== pollutionId)
    });
  }

  // Action to clear all favorites
  @Action(ClearFavories)
  clearFavories(ctx: StateContext<FavorisStateModel>) {
    ctx.patchState({
      favoris: []
    });
  }
}
