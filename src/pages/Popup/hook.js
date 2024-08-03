export function useWord() {
    const [data, setData] = useState({
        words: []
    });

    const saveWord = async (word) => {
        setData({
            ...data,
            words: [...data.words, word]
        });
        localStorage.setItem('words-extension', JSON.stringify(data));
    }

    return (
        saveWord
    )

}