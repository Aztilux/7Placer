import { Queue } from "./SevenQueue";

export function BotSquare(x1: number, y1: number, x2: number, y2: number, color: number) {
    if (x2 < x1) [x1, x2] = [x2, x1]
    if (y2 < y1) [y1, y2] = [y2, y1]

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        Queue.add(x, y, color);
      }
    }
}