import Auth from "../Auth";
import Bot from "../../bot/Bot";
import variables from "../../variables";
import getPainting from "../../requests/get-painting";
import { disconnect } from "../../bot/util/websocket";

const window2 = (window as any)
var LocalAccounts: { username: string, authId: string; authKey: string; authToken: string; }[] = []

// save changes in localstorage
async function storagePush() {
    localStorage.setItem('LocalAccounts', JSON.stringify(LocalAccounts));  
}

// restore localstorage to localaccounts
async function storageGet() {
    LocalAccounts = JSON.parse(localStorage.getItem('LocalAccounts'));
    if (LocalAccounts === null) {
        LocalAccounts = []
    }
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// saves from params
export async function saveAuth(username: string, authId: string, authKey: string, authToken: string, print: boolean = true) {
    if (!authId || !authKey || !authToken) { console.log('[7p] saveAuth ussage: saveAuth(authId, authKey, authToken)'); return }
    const account = { username, authId, authKey, authToken}
    LocalAccounts.push(account)
    storagePush()
    if (print) console.log('Auth saved. Saved list: ', LocalAccounts)
}

// returns client's auth
export async function getAuth(print: boolean = true) {
    const cookieStore = window2.cookieStore
    const authToken = await cookieStore.get("authToken");
    const authKey = await cookieStore.get("authKey");
    const authId = await cookieStore.get("authId");

    if (!authToken || !authKey || !authId) return
    // const userinfo = await getPainting(authId.value, authKey.value, authToken.value)
    if (print) console.log(`authId = "${authId.value}", authKey = "${authKey.value}", authToken = "${authToken.value}"`);
    return { authToken: authToken.value, authKey: authKey.value, authId: authId.value };
}

// saves auth from client cookies
export async function saveAccount() {
    storageGet()
    const AuthObj = await getAuth(false)
    const userinfo = await getPainting(AuthObj.authId, AuthObj.authKey, AuthObj.authToken) 
    saveAuth(userinfo.user.name, AuthObj.authId, AuthObj.authKey, AuthObj.authToken, false)
    console.log('Auth saved. Saved list: ', LocalAccounts)
}

// logs saved auths
export async function getAccounts() {
    storageGet()
    console.log(LocalAccounts)
    if (LocalAccounts == null) { console.log('No accounts found'); return }
    console.log(`Found ${LocalAccounts.length} acccounts`)
}

// deletes auths
export async function deleteAccount(input: string | number) {
    if (input === undefined) { console.log('deleteAccount usage: deleteAccount(name or index)')}
    storageGet()
    if (typeof input == 'string') {
        const index = LocalAccounts.findIndex((account) => account.username.toLowerCase() == input.toLowerCase())
        if (index == -1) { console.log(`[7p] Error deleting: Found no accounts with name ${input}`); return }
        LocalAccounts.splice(index, 1) 
    } else if (typeof input == 'number') {
        LocalAccounts.splice(input, 1) 
    }
    console.log(`Deleted account ${input}`)
    console.log(LocalAccounts)
    storagePush()
}

// connection controls
export async function multibot(param: string, index?: number) {
    storageGet()
    if (!param) { console.log('multiBot usage: ("connectall"), ("connect", index), ("disconnectall"), ("disconnect", index)'); return }
    switch (param.toLowerCase()) {
        case "connectall":
            for (const account of LocalAccounts) {
                // checks if bot is already connected
                const connectedbot = window2.seven.bots.find((bot: Bot) => bot.generalinfo?.user.name == account.username)
                if (connectedbot) { console.log(`[7p] Account ${account.username} is already connected.`); return}
                const auth = new Auth(account)
                new Bot(auth)
                await delay(500)
            }
            break
        case "connect":
            if (index != undefined) { console.log('Missing bot number'); return };
            const account = LocalAccounts[index];
            const connectedbot = window2.seven.bots.find((bot: Bot) => bot.generalinfo?.user.name == account.username)
            if (connectedbot) { console.log(`[7p] Account ${account.username} is already connected.`); return}
            const auth = new Auth(account);
            new Bot(auth);
            break  
        case "disconnectall":
            if (window2.seven.bots.length == 1) return
            index = 0
            for (const bot of window2.seven.bots) {
              if (!bot.isClient)
                disconnect(bot)
            }
            break  
        case "disconnect":
            if (index == undefined) { console.log('[7p] disconnect requires an index.'); return };
            if (index == 0) { console.log('[7p] You cannot disconnect the client'); return }
            disconnect(window2.seven.bots[index])
            break                     
    }       
}