import Canvas from './canvas/Canvas'
import Bot from './bot/Bot'

Object.defineProperty(window.console, 'log', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: console.log
});

export { Canvas }
export { Bot }