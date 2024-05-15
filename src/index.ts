import Canvas from './canvas/Canvas'
import Bot from './bot/Bot'
import Queue from './modules/SevenQueue';
import './modules'
import './variables'
import './css/css'

Object.defineProperty(window.console, 'log', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: console.log
});

export { Canvas }
export { Bot }
export { Queue }
export * from './variables'