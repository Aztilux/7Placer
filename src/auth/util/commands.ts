import Auth from "../Auth";
import { WSBot } from "../../bot/Bot";
import "../../variables"
import getPainting from "../../requests/get-painting";
import { closeBot } from "../../bot/util/websocket";
import requestLogin from "../../requests/login";

const window2 = (window as any)
var LocalAccounts = new Map<string, {authId: string; authKey: string; authToken: string;}>();

// save changes in localstorage
function storagePush() {
    const obj = Object.fromEntries(LocalAccounts);
    localStorage.setItem('LocalAccounts', JSON.stringify(obj));
}

// restore localstorage to localaccounts
function storageGet() {
    const storedAccounts = localStorage.getItem('LocalAccounts');
    if (storedAccounts) {
        const parsedAccounts = JSON.parse(storedAccounts);
        LocalAccounts = new Map(Object.entries(parsedAccounts));
    } else LocalAccounts = new Map();
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// saves from params
export function saveAuth(username: string, authId: string, authKey: string, authToken: string, print: boolean = true) {
    if (!authId || !authKey || !authToken) { console.log('[7p] saveAuth usage: saveAuth(username, authId, authKey, authToken)'); return; }
    const account = { authId, authKey, authToken };
    LocalAccounts.set(username, account)
    storagePush();
    if (print) console.log('Auth saved. Saved list: ', LocalAccounts);
}

// returns client's auth
export async function getAuth(print: boolean = true) {
    const cookieStore = window2.cookieStore;
    const authToken = await cookieStore.get("authToken");
    const authKey = await cookieStore.get("authKey");
    const authId = await cookieStore.get("authId");
    if (authToken == null || authKey == null || authId == null) { console.log('[7p] Please login first!'); return }

    if (print) console.log(`authId = "${authId.value}", authKey = "${authKey.value}", authToken = "${authToken.value}"`);
    return { authToken: authToken.value, authKey: authKey.value, authId: authId.value };
}

// saves auth from client cookies
export async function saveAccount() {
    storageGet();
    const AuthObj = await getAuth(false);
    const userinfo = await getPainting(AuthObj.authId, AuthObj.authKey, AuthObj.authToken);
    saveAuth(userinfo.user.name, AuthObj.authId, AuthObj.authKey, AuthObj.authToken, false);
    console.log('Auth saved. Saved list: ', LocalAccounts);
}

// logs saved auths
export function getAccounts() {
    storageGet();
    if (!LocalAccounts || LocalAccounts.size == 0) { 
        console.log('No accounts found'); 
        return;
    }
    console.log(`Found ${LocalAccounts.size} accounts`);
    console.log(LocalAccounts);
}

// deletes auths
export function deleteAccount(identifier: string | number) {
    if (identifier == null) { console.log('deleteAccount usage: deleteAccount(user or index)'); return; }
    storageGet();

    if (typeof identifier == 'string') {
        if (identifier == 'all') {
            LocalAccounts.forEach((value, key) => {
                LocalAccounts.delete(key)
            });
            return;
        }

        if (!LocalAccounts.has(identifier)) { console.log(`[7p] Error deleting: No account with name ${identifier}`); return; }
        LocalAccounts.delete(identifier)
        console.log(`[7p] Deleted account ${identifier}.`);
        console.log(LocalAccounts);
    }

    if (typeof identifier == 'number') {
        const keys = Array.from(LocalAccounts.keys());
        if (identifier > keys.length) { console.log(`[7p] Error deleting: No account with index ${identifier}`); return; }
        LocalAccounts.delete(keys[identifier]);
        console.log(`Deleted account ${identifier}`);
        console.log(LocalAccounts);
    }
    
    storagePush();
}


export async function connect(username: string) {
    storageGet();
    const account = LocalAccounts.get(username)
    const connectedbot = window2.seven.bots.find((bot: WSBot) => bot.generalinfo?.user.name == username);

    if (!username) { console.log('[7p] Missing bot username, connect("username")'); return; }

    if (username == 'all') {
        for (const [username, account] of LocalAccounts) {
            // checks if bot is already connected
            const connectedbot = window2.seven.bots.find((bot: WSBot) => bot.generalinfo?.user.name == username);
            const auth = new Auth(account);

            if (connectedbot) { console.log(`[7p] Account ${username} is already connected.`); continue; }

            new WSBot(auth, username);
            await delay(500);
        }
        return
    }

    if (!account) { console.log(`[7p] No account found with username ${username}`); return; }
    if (connectedbot) { console.log(`[7p] Account ${username} is already connected.`); return; }

    const auth = new Auth(account);
    new WSBot(auth, username);
}


export function disconnect(username: string) {
    const bot = window2.seven.bots.find((bot: WSBot) => bot.generalinfo?.user.name == username);

    if (!username) { console.log('[7p] disconnect requires a username, disconnect("username")'); return; }

    if (username == 'all') {
        if (window2.seven.bots.length == 1) { console.log('[7p] No bots connected.'); return; }
        for (const bot of window2.seven.bots) {
            closeBot(bot);
        }
        return
    }

    if (!bot) { console.log(`[7p] No bot connected with username ${username}`); return }

    closeBot(bot); 
}

// !! Private !!
export function echo(message: string) {
    for (const bot of window2.seven.bots) {
        bot.emit('chat.message', `{"text":"${message}","mention":"","type":"global","target":"","color":0}`)
    }
}

// !! Private !!
export async function login(email: string, password: string, captcha?: string) {
    await requestLogin(email, password, captcha)
}
