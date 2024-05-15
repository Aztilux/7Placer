import Auth from "../Auth";
import Bot from "../../bot/Bot";
import '../../variables'

const window2 = (window as any)
var LocalAccounts: { authId: string; authKey: string; authToken: string; }[] = []

// save changes in localstorage
async function storagePush() {
    localStorage.setItem('LocalAccounts', JSON.stringify(LocalAccounts));  
}

// restore localstorage to localaccounts
async function storageGet() {
    LocalAccounts = JSON.parse(localStorage.getItem('LocalAccounts'));
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
    const receivedAccounts = JSON.parse(localStorage.getItem('LocalAccounts'));
    console.log(receivedAccounts)
    if (receivedAccounts == null) { console.log('No accounts found'); return }

    storageGet()
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
    switch (param) {
        case "ConnectAll":
            for (const account of LocalAccounts) {
              const auth = new Auth(account)
              const bot = new Bot(auth)
              console.log(`[7p] Attempting to connect bot ${bot.botid}`)
            }
            break
        case "Connect":
            if (index != undefined) { console.log('Missing bot number'); return };
            const account = LocalAccounts[index];
            const auth = new Auth(account);
            const bot = new Bot(auth);
            break  
        case "DisconnectAll":
            index = 0
            for (index; index < window2.seven.bots.length;) {
              const bot = window2.seven.bots[index]
              if (!bot.isClient) {
                bot.ws.close() 
                window2.seven.bots.splice(1, 1) 
                console.log('Disconnected number ', bot.botid)
              }
              if (index != window2.seven.bots.length-1) index = index + 1
            }
            break  
        case "Disconnect":
            if (index == undefined) { console.log('Missing bot number'); return };
            if (index == 0) { console.log('You cannot disconnect the client'); return}

            window2.seven.bots[index].ws.close(); 
            window2.seven.bots.splice(index, 1) 
            break                     
    }       
}