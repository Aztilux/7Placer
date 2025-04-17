import * as cmd from './auth/util/commands'

window.seven = {
    bots: new Map(),
    pixelspeed: 21,
    queue: [],
    inprogress: false,
    protect: false,
    tickspeed: 1000,
    order: 'fromCenter',
    multi: cmd.public_commands,
    dither: null
}

