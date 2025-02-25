import * as cmd from './auth/util/commands'

(window as any).seven = {
    bots: [],
    pixelspeed: 21,
    queue: [],
    inprogress: false,
    protect: false,
    tickspeed: 1000,
    order: 'fromCenter',
    saveAuth: cmd.saveAuth,
    getAuth: cmd.getAuth,
    saveAccount: cmd.saveAccount,
    getAccounts: cmd.getAccounts,
    deleteAccount: cmd.deleteAccount,
    connect: cmd.connect,
    disconnect: cmd.disconnect,
}