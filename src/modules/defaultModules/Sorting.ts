const workerCode = `
    self.onmessage = function (e) { // {array: {x: number, y: number, color: number}[], order: string}
        let array = e.data.array
        switch (e.data.order) {
            case 'none':
            break

            case 'rand':
            array.sort(() => Math.random() - 0.5);
            break

            case 'colors':
            array.sort((a, b) => a.color - b.color);
            break

            case 'vertical':
            array.sort((a, b) => a.x - b.x);
            break

            case 'horizontal':
            array.sort((a, b) => a.y - b.y);
            break

            default:
            case 'circle':
            const CX = Math.floor((array[0].x + array[array.length - 1].x) / 2);
            const CY = Math.floor((array[0].y + array[array.length - 1].y) / 2);
            array.sort((a, b) => {
                const distanceA = Math.sqrt((a.x - CX) ** 2 + (a.y - CY) ** 2);
                const distanceB = Math.sqrt((b.x - CX) ** 2 + (b.y - CY) ** 2);
                return distanceA - distanceB;
            });
        }
        self.postMessage(array)
    };
`;
const blob = new Blob([workerCode], { type: 'application/javascript' });
const blobUrl = URL.createObjectURL(blob);

export default async function sort(array: {x: number, y: number, color: number}[], order: string): Promise<{x: number, y: number, color: number}[]> {
    const pixel_array = await new Promise(resolve => {
        let t0 = performance.now()
        let sorting_toast = Toastify({
            text: `Sorting...`,
            duration: 100000,
            style: {
                background: "#1a1a1a",
                border: "solid var(--gui-main-color)"
            },
        }).showToast();
        const worker = new Worker(blobUrl);
        worker.postMessage({ array: array, order: order });
        worker.onmessage = function (e) {
            resolve(e.data);
            console.log(`Sorted in ${performance.now() - t0}`)
            sorting_toast.hideToast();
            clearTimeout(long_sort_timeout);
        };
        let long_sort_timeout = setTimeout(() => {
            Toastify({
                text: `If sorting is taking too long consider using "sort: none"`,
                duration: 10000,
                style: {
                    background: "#1a1a1a",
                    border: "solid rgb(255, 251, 0)"
                },
            }).showToast();
        }, 7000);
    });
    return pixel_array as {x: number, y: number, color: number}[];
}
