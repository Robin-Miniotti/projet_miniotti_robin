export class SetAccessToken {
  static readonly type = '[Auth] Set Access Token';

  constructor(public accesToken: String) {}
}

export class DeleteAccessToken {
  static readonly type = '[Auth] Delete Access Token';

  constructor() {}
}
