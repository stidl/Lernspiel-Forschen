/**
 * 
 * @template T
 * @param {T[]} arr 
 * @returns {T[]}
 */
export function shuffle(arr) {
    return [...arr].sort(() => 0.5 - Math.random());
}

/**
 * @template T
 * @param {T[]} arr 
 * @param {number} n 
 * @returns {T[]}
 */
export function randomItems(arr, n) {
    let len = arr.length;
    if (n > len) {
        throw new RangeError(
            "getRandomQuestions: more elements taken than available"
        );
    }

    //makes copy of original array and shuffles through it 
    const shuffled = shuffle(arr)

    //getting n elements out of the shuffeled elements  
    return shuffled.slice(0, n);
}