const ac = require("@antiadmin/anticaptchaofficial");

ac.setAPIKey('9789ddcf019913082bd02dd76c83b62a');

export default async function requestLogin(email: string, password: string, captcha?: string): Promise<any> {
    const formData = new FormData();
    if (!captcha) {
      try {
        console.log('solving turnstile.');
        // captcha = await ac.solveTurnstileProxyless('https://pixelplace.io', '0x4AAAAAAAC1ps4w6nfwaJ78')
      } catch (e) {
        console.log(e);
        return
      }
    }
    // var controlHeader = getCacheL0cal()
    formData.append("email", email);
    formData.append("password", password);
    formData.append("captchaCF", captcha);
    const response = await fetch(`https://pixelplace.io/api/login.php`, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        // 'Cache-L0cal': controlHeader
      },
      body: formData,
    });

    const json = response.json();
    return json;
}
