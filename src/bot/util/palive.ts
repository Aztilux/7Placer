// credits to symmetry

function randomString(charList: string, num: number) {
  return Array.from({ length: num }, () => charList.charAt(Math.floor(Math.random() * charList.length))).join('');
}

function randomString1(num: number) {
  const charList = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return randomString(charList, num);
}

function randomString2(num: number) {
  const charList = 'gmbonjklezcfxta1234567890GMBONJKLEZCFXTA';
  return randomString(charList, num);
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
  "9": "o",
};

export default function getPalive(serverTime: number, userId: number) {
  const tDelay = getTDelay(serverTime)
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


  result += userId.toString().substring(0, 1) + (randInt(0, 1) == 1 ? randomString2(randInt(4, 20)) : randomString1(randInt(4, 25)));

  return result + "0=";
}

export function getTDelay(serverTime: number): number {
  const currentTime = new Date().getTime() / 1e3;
  return Math.floor(serverTime - currentTime);
}