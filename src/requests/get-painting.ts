import getCookie from "./getCookie";
import Canvas from "../canvas/Canvas";
import { canvascss } from "../GUI/style";
export default async function getPainting(authId: string, authKey: string, authToken: string): Promise<any> {
  const canvas = Canvas.instance;
  const originalAuthId = getCookie('authId');
  const originalAuthKey = getCookie('authKey');
  const originalAuthToken = getCookie('authToken');

  document.cookie = `authId=${authId}; path=/`;
  document.cookie = `authKey=${authKey}; path=/`;
  document.cookie = `authToken=${authToken}; path=/`;

  try {
    const response = await fetch(`https://pixelplace.io/api/get-painting.php?id=${canvas.ID}&connected=1`, {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
      },
      credentials: 'include'
    });

    const json = response.json();
    return json;
  } finally {
    document.cookie = `authId=${originalAuthId}; path=/`;
    document.cookie = `authKey=${originalAuthKey}; path=/`;
    document.cookie = `authToken=${originalAuthToken}; path=/`;
  }
}
