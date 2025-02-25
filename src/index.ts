import packageInfo from '../package.json';

// @ts-ignore (GLOBAL IMPORT)
const context = require.context('./', true, /\.*/);
context.keys().forEach(context);

Object.defineProperty(window.console, 'log', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: console.log
});

console.log('7Placer Loaded! Version:', packageInfo.version);