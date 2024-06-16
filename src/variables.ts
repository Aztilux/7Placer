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
  saveAccount: cmd.saveAccount,
  getAccounts: cmd.getAccounts,
  deleteAccount: cmd.deleteAccount,
  multibot: cmd.multibot,
}