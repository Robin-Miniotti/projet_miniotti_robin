import { Auth } from "../models/auth";

export class AuthConnexion {
  static readonly type = '[Auth] connexion';

  constructor(public payload: Auth) {}
}

export class AuthDeconnexion {
  static readonly type = '[Auth] deconnexion';

  constructor() {}
}
