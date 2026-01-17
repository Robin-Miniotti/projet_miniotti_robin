export class SetAccessToken {
  static readonly type = '[Auth] Set Access Token';

  constructor(public accesToken: string) {}
}

export class DeleteAccessToken {
  static readonly type = '[Auth] Delete Access Token';

  constructor() {}
}
