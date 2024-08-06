import * as XLSX from 'xlsx';

export const speak = (word) => {
    if ('speechSynthesis' in window) {
        var synthesis = window.speechSynthesis;

        var voice = synthesis.getVoices().filter(function (voice) {
            return voice.lang === 'en-US';
        })[0];

        var utterance = new SpeechSynthesisUtterance(word);

        utterance.voice = voice;
        utterance.rate = 0.8;
        utterance.volume = 0.6;

        synthesis.speak(utterance);
    } else {
        console.log('Text-to-speech not supported.');
    }
}


export const openDictionary = (word) => {
    chrome.tabs.create({ url: `https://dictionary.cambridge.org/vi/dictionary/english/${word.text}` });
}

export const exportData = (words) => {
    const data = words.map((word) => ({
        Word: word.text?.toLowerCase(),
        Meaning: word.meaning,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const todayString = new Date().toISOString().split('T')[0];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Vocabulary");
    XLSX.writeFile(workbook, `Word-Saver-${todayString}.xlsx`);
}

export const importData = (e, setWords) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);

        const words = sheetData.map((row) => ({
            text: row.Word?.toLowerCase(),
            meaning: row.Meaning,
        }));

        chrome.storage.sync.set({ "data": { words } }, function () {
            setWords(words);
        });
    };

    reader.readAsBinaryString(file);
}

export const deleteAllWord = (setWords) => {
    confirm('Are you sure you want to remove all words?') &&
        chrome.storage.sync.set({ "data": { words: [] } }, function () {
            setWords([]);
        });
}

export const deleteWord = (word, setWords) => {
    chrome.storage.sync.get("data", function ({ data }) {
        const words = data?.words || [];
        const newWords = words.filter(w => w.text !== word.text);
        chrome.storage.sync.set({ "data": { words: newWords } }, function () {
            setWords(newWords);
        });
    });
}

export const updateWordMeaning = (word, meaning, setWords) => {
    chrome.storage.sync.get("data", function ({ data }) {
        const words = data?.words || [];
        const newWords = words.map(w => w.text === word.text ? { ...w, meaning } : w);
        chrome.storage.sync.set({ "data": { words: newWords } }, function () {
            setWords(newWords);
        });
    });
}

export const load = (setWords) => {
    chrome.storage.sync.get("data", function ({ data }) {
        setWords(data?.words || []);
    });
}

export const addWordBackground = (word) => {
    chrome.storage.sync.get("data", function ({ data }) {
        const words = data?.words || [];
        words.unshift({
            text: word,
            meaning: ''
        });
        chrome.storage.sync.set({ "data": { words } }, function () {
            console.log("set", words);
        });
    });
}

export const copyClipboard = (text) => {
    navigator.clipboard.writeText(text);
} 