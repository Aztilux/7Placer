import Canvas from './canvas/Canvas'
import { Bot } from './bot/Bot'
import Queue from './modules/defaultModules/SevenQueue';
import './modules'
import './variables'
import './css/style'

Object.defineProperty(window.console, 'log', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: console.log
});

import packageInfo from '../package.json';
console.log('7Placer Loaded! Version:', packageInfo.version)

export { Canvas }
export { Bot }
export { Queue }
export * from './modules'
export * from './variables'