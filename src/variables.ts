import * as cmd from './auth/util/commands'

export default (window as any).seven = {
  bots: [],
  pixelspeed: 21,
  queue: [],
  inprogress: false,
  protect: false,
  tickspeed: 1000,
  saveAuth: cmd.saveAuth,
  getAuth: cmd.getAuth,
  setAccount: cmd.setAccount,
  getAccounts: cmd.getAccounts,
  deleteAccount: cmd.deleteAccount,
  multiBot: cmd.multiBot,
}