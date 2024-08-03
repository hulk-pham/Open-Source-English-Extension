import React, { useEffect, useState } from 'react';
import speakerIcon from '../../assets/img/icons8-speaker-30.png';
import browserIcon from '../../assets/img/icons8-browser-30.png';
import trashIcon from '../../assets/img/icons8-trash-30.png';
import emptyIcon from '../../assets/img/icons8-empty-flag-30.png';
import './Popup.css';

const speak = (word) => {
  if ('speechSynthesis' in window) {
    var synthesis = window.speechSynthesis;

    // Get the first `en` language voice in the list
    var voice = synthesis.getVoices().filter(function (voice) {
      return voice.lang === 'en-US';
    })[0];

    // Create an utterance object
    var utterance = new SpeechSynthesisUtterance(word);

    // Set utterance properties
    utterance.voice = voice;
    // utterance.pitch = 1.5;
    utterance.rate = 0.8;
    utterance.volume = 0.6;

    // Speak the utterance
    synthesis.speak(utterance);
  } else {
    console.log('Text-to-speech not supported.');
  }
}

const Word = ({ word, onClickWord, onSpeak, onBrowser, onDelete }) => {
  return (
    <div className='word'>
      <span onClick={() => onClickWord(word)}>{word}</span>
      <div className='tool-tip-container'>
        <img className='icon' src={speakerIcon} alt='speaker' onClick={() => onSpeak(word)} />
        <img className='icon' src={browserIcon} alt='speaker' onClick={() => onBrowser(word)} />
        <img className='icon' src={trashIcon} alt='speaker' onClick={() => onDelete(word)} />
      </div>
    </div>
  );
}

const Empty = () => {
  return (
    <div className='empty-container'>
      <img src={emptyIcon} alt='empty' className='icon' />
      <div>Add words to start learning</div>
    </div>
  );
}
const Popup = () => {
  const [words, setWords] = useState([]);
  useEffect(() => {
    chrome.storage.sync.get("data", function ({ data }) {
      const wordInStorage = data?.words || [];
      setWords(wordInStorage);
    });
  }, []);

  const onClickWord = (word) => {
  }

  const onSpeak = (word) => {
    speak(word);
  }

  const onBrowser = (word) => {
    chrome.tabs.create({ url: `https://dictionary.cambridge.org/vi/dictionary/english/${word}` });
  }

  const onDelete = (word) => {
    chrome.storage.sync.get("data", function ({ data }) {
      const words = data?.words || [];
      const newWords = words.filter(w => w !== word);
      chrome.storage.sync.set({ "data": { words: newWords } }, function () {
        setWords(newWords);
      });
    });
  }

  return (
    <div className="container">
      <header className="header">
        <span></span>
        Word Saver
        <div className='nav-bar'>
          {/* <span className='clear-all'>Clear All</span> */}
        </div>
      </header>
      {
        words.length === 0
          ? <Empty />
          :
          <main className='word-container'>
            {
              words.map((word, index) => <Word
                word={word}
                index={index}
                onClickWord={onClickWord}
                onSpeak={onSpeak}
                onBrowser={onBrowser}
                onDelete={onDelete}
              />)
            }
          </main>

      }

      {/* <article className='footer'>
        <embed type="text/hrml" src={`https://dictionary.cambridge.org/vi/dictionary/english/${selectedWord}`} width="300" height="200" />
      </article> */}
    </div>
  );
};

export default Popup;
