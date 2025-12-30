import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Pollution } from '../models/pollution';
import { AddFavori } from './addfavori.action';
import { RemoveFavori } from './removefavori.action';
import { ClearFavories } from './clearfavories.action';
import { FavorisState } from './favoris.state';

@Injectable({
  providedIn: 'root'
})
export class FavorisService {

  constructor(private store: Store) {}

  /**
   * Get all favorites as an observable
   */
  getFavoris(): Observable<Pollution[]> {
    return this.store.select(FavorisState.getFavoris);
  }

  /**
   * Get favorites count as an observable
   */
  getFavorisCount(): Observable<number> {
    return this.store.select(FavorisState.getFavorisCount);
  }

  /**
   * Get all favorites as a snapshot
   */
  getFavorisSnapshot(): Pollution[] {
    return this.store.selectSnapshot(FavorisState.getFavoris);
  }

  /**
   * Check if a pollution is in favorites
   */
  isFavori(pollutionId: number): boolean {
    const isFavoriSelector = this.store.selectSnapshot(FavorisState.isFavori);
    return isFavoriSelector(pollutionId);
  }

  /**
   * Add a pollution to favorites
   */
  addFavori(pollution: Pollution): void {
    this.store.dispatch(new AddFavori(pollution));
  }

  /**
   * Remove a pollution from favorites by ID
   */
  removeFavori(pollutionId: number): void {
    this.store.dispatch(new RemoveFavori(pollutionId));
  }

  /**
   * Toggle a pollution in favorites (add if not present, remove if present)
   */
  toggleFavori(pollution: Pollution): void {
    if (this.isFavori(pollution.id)) {
      this.removeFavori(pollution.id);
    } else {
      this.addFavori(pollution);
    }
  }

  /**
   * Clear all favorites
   */
  clearFavories(): void {
    this.store.dispatch(new ClearFavories());
  }
}
