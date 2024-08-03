import axios from 'axios';

const baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function getDefinition(word: string) {
    const response = await axios.get(`${baseUrl}/${word}`);
    return response.data;
}