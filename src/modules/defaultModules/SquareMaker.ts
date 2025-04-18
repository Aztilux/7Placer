import Queue from "./Queue";
import sort from "./Sorting";

export async function BotSquare(x1: number, y1: number, x2: number, y2: number, color: number) {
    if (!x1 || !y1 || !x2 || !y2 || color === undefined) return
    const seven = window.seven;
    var result: {x: number, y: number, color: number}[] = []
    if (x2 < x1) [x1, x2] = [x2, x1]
    if (y2 < y1) [y1, y2] = [y2, y1]

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        result.push({ x, y, color });
      }
    }
    result = await sort(result, seven.order)
    result.forEach((pixel) => {
      Queue.add(pixel.x, pixel.y, pixel.color, true)
    })
    Toastify ({
        text: `Square from ${x1}, ${y1} TO ${x2}, ${y2} with color ID ${color}`,
        style: {
            background: "#1a1a1a",
            border: "solid var(--gui-main-color)"
        },
    }).showToast();
}
