export default class Auth {
  public authKey: string
  public authId: string
  public authToken: string

  constructor(authObj: {authId: string, authKey: string, authToken: string}) {
    this.authKey = authObj.authKey
    this.authId = authObj.authId
    this.authToken = authObj.authToken
  }
}