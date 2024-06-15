import Auth from "../Auth";
import Bot from "../../bot/Bot";
import getPainting from "../../requests/get-painting";
import '../../variables'
import { disconnect } from "../../bot/util/websocket";

const window2 = (window as any)
var LocalAccounts: { authId: string; authKey: string; authToken: string; }[] = []

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

// saves from params
export async function saveAuth(authId: string, authKey: string, authToken: string) {
    const account = {authId, authKey, authToken}
    LocalAccounts.push(account)
    storagePush()
    console.log('Auth saved. Saved list: ', LocalAccounts)
}

// returns client's auth
export async function getAuth(print: boolean = true) {
    const cookieStore = (window as any).cookieStore
    const authToken = await cookieStore.get("authToken");
    const authKey = await cookieStore.get("authKey");
    const authId = await cookieStore.get("authId");

    if (!authToken || !authKey || !authId) return
    // const userinfo = await getPainting(authId.value, authKey.value, authToken.value)
    if (print) console.log(`authId = "${authId.value}", authKey = "${authKey.value}", authToken = "${authToken.value}"`);
    return { authToken: authToken.value, authKey: authKey.value, authId: authId.value };
}

// saves auth from client cookies
export async function setAccount() {
    storageGet()
    const AuthObj = await getAuth(false)
    LocalAccounts.push(AuthObj)
    storagePush()
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
export async function deleteAccount(index: number) {
    storageGet()
    LocalAccounts.splice(index, 1)
    console.log(LocalAccounts)
    storagePush()
}

// connection controls
export async function multiBot(param: string, index?: number) {
    storageGet()
    switch (param.toLowerCase()) {
        case "connectall":
            for (const account of LocalAccounts) {
              const auth = new Auth(account)
              new Bot(auth)
              await delay(500)
            }
            break
        case "connect":
            if (index != undefined) { console.log('Missing bot number'); return };
            const account = LocalAccounts[index];
            const auth = new Auth(account);
            new Bot(auth);
            break  
        case "disconnectall":
            if (window2.seven.bots.length == 1) return
            index = 0
            for (const bot of window2.seven.bots) {
              if (!bot.isClient) {
                disconnect(bot)
              }
            }
            break  
        case "disconnect":
            if (index == undefined) { console.log('Missing bot number'); return };
            if (index == 0) { console.log('You scannot disconnect the client'); return }
            disconnect(window2.seven.bots[index])
            break                     
    }       
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }