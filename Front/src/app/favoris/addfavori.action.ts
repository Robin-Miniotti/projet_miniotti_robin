import { Pollution } from '../models/pollution';

// Action to add a favori
export const ADD_FAVORI = '[Favoris] Add Favori';
export class AddFavori {
  static readonly type = ADD_FAVORI;
  constructor(public payload: Pollution) {}
}
