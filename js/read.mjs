const FilePath = "js.json";

/**
 * @returns {Promise<Question[]>} The questions
 */
async function readQuestions() {
    /**
     * @type {Object[]}
     */
    const entries = await fetch(FilePath).then(res=>res.json());


return entries.map(entry=>({
    id: entry.id,
    text: entry.question,
    answers: [
        { text: entry.a, isCorrect: entry.answer === 'a'},
        { text: entry.b, isCorrect: entry.answer === 'b'},
        { text: entry.c, isCorrect: entry.answer === 'c'},
        { text: entry.d, isCorrect: entry.answer === 'd'},
        { text: entry.e, isCorrect: entry.answer === 'e'},
    ]
}));
}

export default readQuestions;