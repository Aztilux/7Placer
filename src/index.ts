import packageInfo from '../package.json';
import { loadCss } from './util/ExternalLoader';

// @ts-ignore (GLOBAL IMPORT)
const context = require.context('./', true, /\*.ts/);
context.keys().forEach(context);

Object.defineProperty(window.console, 'log', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: console.log
});

console.log('7Placer Loaded! Version:', packageInfo.version);

loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
window.onload = () => {
    Toastify ({
        text: '7Placer Loaded!',
    }).showToast();
}