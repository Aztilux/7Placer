import packageInfo from '../package.json';
import Canvas from './canvas/Canvas';
import { loadCss } from './util/ExternalLoader';

// @ts-ignore (GLOBAL IMPORT)
const context = require.context('./', true, /^(?!.*global\.d).+/);
context.keys().forEach(context);
Object.defineProperty(window.console, 'log', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: console.log
});

console.log(`%c7Placer Loaded! Version: ${packageInfo.version}`, 'color: chartreuse; font-size: 60px; font-style: italic;');

loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');

const intervalId = setInterval(() => {
    if (document.getElementById('canvas')) {
        clearInterval(intervalId);
        Toastify ({
            text: `7Placer ${packageInfo.version} Loaded! Loading canvas...`,
            style: {
                background: "#1a1a1a",
                border: "solid var(--gui-main-color)"
            },
            callback: () => {
                Toastify ({
                    text: `Click me to join the discord.`,
                    destination: "https://discord.gg/3fXfQp7Rms",
                    newWindow: true,
                    style: {
                        background: "#1a1a1a",
                        border: "solid var(--gui-main-color)"
                    },
                }).showToast();
            }
        }).showToast();
        Canvas.instance
    }
}, 100);
