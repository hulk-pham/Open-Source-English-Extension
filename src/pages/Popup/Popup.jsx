import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import browserIcon from '../../assets/img/icons8-browser-30.png';
import removeAllIcon from '../../assets/img/icons8-disposal-40.png';
import emptyIcon from '../../assets/img/icons8-empty-flag-30.png';
import exportCSVIcon from '../../assets/img/icons8-export-csv-40.png';
import gridIcon from '../../assets/img/icons8-grid-40.png';
import importCSVIcon from '../../assets/img/icons8-import-csv-40.png';
import listIcon from '../../assets/img/icons8-list-40.png';
import speakerIcon from '../../assets/img/icons8-speaker-30.png';
import trashIcon from '../../assets/img/icons8-trash-30.png';
import './Popup.css';
import { copyClipboard, deleteAllWord, deleteWord, exportData, importData, load, openDictionary, speak, updateWordMeaning } from './utils';

const Word = ({ word, onClickWord, onSpeak, onBrowser, onDelete, layout, openPopupMeaning }) => {
  return (
    <div className={`word ${layout}`}>
      <div className='word-text'>
        <span onClick={() => onClickWord(word)}>{word.text}</span>
      </div>
      <div className='meaning' onClick={() => openPopupMeaning(word)}>{
        word.meaning ? word.meaning : "?"
      }</div>
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
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedMeaning, setSelectedMeaning] = useState('');
  const [layout, setLayout] = useState('grid');
  useEffect(() => {
    load(setWords);
  }, []);

  const onClickWord = (word) => {
    copyClipboard(word.text);
  }

  const onSpeak = (word) => {
    speak(word.text);
  }

  const onBrowser = (word) => {
    openDictionary(word);
  }

  const onDelete = (word) => {
    deleteWord(word, setWords);
  }

  const onExport = () => {
    exportData(words);
  }

  const handleFileUpload = (e) => {
    importData(e, setWords);
  };

  const clearAll = () => {
    deleteAllWord(setWords);
  }

  const openPopupMeaning = (word) => {
    setSelectedWord(word);
    setSelectedMeaning(word.meaning || '');
  }

  const submitChangeMeaning = () => {
    updateWordMeaning(selectedWord, selectedMeaning, setWords);
    setSelectedWord(null);
    setSelectedMeaning('');
  }

  const onChangeText = (e) => {
    setSelectedMeaning(e.target.value);
  }

  return (
    <div className="container">
      <header className="header">
        <div className='nav-bar left'>
          <span className={`icons ${layout == 'grid' ? '' : 'gray'}`} onClick={() => setLayout('grid')} alt='Grid'>
            <img className='icon' src={gridIcon} />
          </span>
          <span className={`icons ${layout == 'list' ? '' : 'gray'}`} onClick={() => setLayout('list')} alt='List'>
            <img className='icon' src={listIcon} />
          </span>

        </div>
        Word Saver
        <div className='nav-bar'>
          <label for="upload">
            <span className='icons' alt='Import'>
              <img className='icon' src={importCSVIcon} />
            </span>
            <input type="file" id="upload" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <span className='icons' onClick={onExport} alt='Export'>
            <img className='icon' src={exportCSVIcon} />
          </span>
          <span className='icons' onClick={clearAll} alt='Remove All'>
            <img className='icon' src={removeAllIcon} />
          </span>
        </div>
      </header>
      {
        words.length === 0
          ? <Empty />
          :
          <main className={`word-container ${layout}`}>
            {
              words.map((word, index) => <Word
                word={word}
                index={index}
                onClickWord={onClickWord}
                onSpeak={onSpeak}
                onBrowser={onBrowser}
                onDelete={onDelete}
                openPopupMeaning={openPopupMeaning}
                layout={layout}
              />)
            }
          </main>

      }
      {
        selectedWord && <article className='popup'>
          <input type='text' value={selectedMeaning} onChange={onChangeText} />
          <button className='submit' onClick={submitChangeMeaning}>Save</button>
          <button className='close' onClick={() => setSelectedWord(null)}>Close</button>
        </article>
      }

      <article className='footer'>
        <p> Powererd by Hulk Pham </p>
      </article>
    </div>
  );
};

export default Popup;
