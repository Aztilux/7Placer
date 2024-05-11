import Canvas from './canvas/Canvas'
import Bot from './bot/Bot'
import "./plguin"
import Queue from './util/queue';

Object.defineProperty(window.console, 'log', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: console.log
});

(self as any).pixelspeed = 19

export { Canvas }
export { Bot }