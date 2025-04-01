export default function sort(array: {x: number, y: number, color: number}[], order: string) {
    const seven = window.seven
    switch (seven.order) {
        case 'rand':
        array.sort(() => Math.random() - 0.5);
        return array;

        case 'colors':
        array.sort((a: { color: number }, b: { color: number }) => a.color - b.color);
        return array;

        case 'vertical':
        array.sort((a: { x: number }, b: { x: number }) => a.x - b.x);
        return array;

        case 'horizontal':
        array.sort((a: { y: number }, b: { y: number }) => a.y - b.y);
        return array;

        default:
        case 'circle':
        const CX = Math.floor((array[0].x + array[array.length - 1].x) / 2);
        const CY = Math.floor((array[0].y + array[array.length - 1].y) / 2);
        array.sort((a: { x: number; y: number }, b: { x: number; y: number }) => {
            const distanceA = Math.sqrt((a.x - CX) ** 2 + (a.y - CY) ** 2);
            const distanceB = Math.sqrt((b.x - CX) ** 2 + (b.y - CY) ** 2);
            return distanceA - distanceB;
        });
        return array;
    }
    }
