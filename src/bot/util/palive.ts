// credits to symm
export default function getPalive(serverTime: number) {

  function getTDelay(): number {
    const currentTime = new Date().getTime() / 1e3;
    let tdelay = 0;
    if (serverTime < currentTime) {
      tdelay = serverTime - currentTime;
    } else serverTime > currentTime && (tdelay = serverTime - currentTime);
  
    return Math.round(tdelay);
  }

  const tDelay = getTDelay()

  function randomString2(num: number) {
    const arr = [];
    const charList = 'gmbonjklezcfxta1234567890GMBONJKLEZCFXTA';
    for (let i = 0; i < num; i++) {
        arr.push(charList.charAt(Math.floor(Math.random() * charList.length)));
    }
    return arr.join('');
  }
  function randomString1(num: number) {
    const arr = [];
    const charList = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < num; i++) {
        arr.push(charList.charAt(Math.floor(Math.random() * charList.length)));
    }
    return arr.join('');
  }
  
  function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const paliveCharmap: {[key: string]: string} = {
    "0": "g",
    "1": "n",
    "2": "b",
    "3": "r",
    "4": "z",
    "5": "s",
    "6": "l",
    "7": "x",
    "8": "i",
    "9": "o"
  }

  const sequenceLengths = [6, 5, 9, 4, 5, 3, 6, 6, 3];
  const currentTimestamp = Math.floor(Date.now() / 1000) + tDelay - 5400;
  const timestampString = currentTimestamp.toString();
  const timestampCharacters = timestampString.split('');

  let result = '';
  for(let i=0;i<sequenceLengths.length;i++) {
      const sequenceNumber = sequenceLengths[i];
      result += randInt(0, 1) == 1 ? randomString2(sequenceNumber) : randomString1(sequenceNumber);

      const letter = paliveCharmap[parseInt(timestampCharacters[i])];
      result += randInt(0, 1) == 0 ? letter.toUpperCase() : letter;
  }

  result += 2 + (randInt(0, 1) == 1 ? randomString2(randInt(4, 20)) : randomString1(randInt(4, 25)));
  
  return result + "0=";
}
