// Action to remove a favori
export const REMOVE_FAVORI = '[Favoris] Remove Favori';
export class RemoveFavori {
  static readonly type = REMOVE_FAVORI;
  constructor(public payload: number) {} // pollution ID
}
