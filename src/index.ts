import Canvas from './canvas/Canvas'
import Bot from './bot/Bot'
import "./plguin"
import Queue from './util/queue';
import './variables'

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