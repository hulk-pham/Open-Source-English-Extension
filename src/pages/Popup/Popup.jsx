import React, { useEffect, useState } from 'react';
import browserIcon from '../../assets/img/icons8-browser-30.png';
import removeAllIcon from '../../assets/img/icons8-disposal-40.png';
import emptyIcon from '../../assets/img/icons8-empty-flag-30.png';
import exportCSVIcon from '../../assets/img/icons8-export-csv-40.png';
import importCSVIcon from '../../assets/img/icons8-import-csv-40.png';
import speakerIcon from '../../assets/img/icons8-speaker-30.png';
import gridIcon from '../../assets/img/icons8-grid-40.png';
import listIcon from '../../assets/img/icons8-list-40.png';
import trashIcon from '../../assets/img/icons8-trash-30.png';
import { deleteAllWord, deleteWord, importData, load, openDictionary, speak } from './utils';
import * as XLSX from 'xlsx';
import './Popup.css';

const Word = ({ word, onClickWord, onSpeak, onBrowser, onDelete, layout }) => {
  return (
    <div className={`word ${layout}`}>
      <div>
        <span onClick={() => onClickWord(word)}>{word.text}</span>
      </div>
      {word.meaning && <div className='meaning'>{word.meaning}</div>}
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
  const [layout, setLayout] = useState('grid');
  useEffect(() => {
    load(setWords);
  }, []);

  const onClickWord = (word) => {
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

  const exportData = (words) => {
    const data = words.map((word) => ({
      Word: word.text,
      Meaning: word.meaning,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const todayString = new Date().toISOString().split('T')[0];
    console.log(todayString);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vocabulary");
    XLSX.writeFile(workbook, `Word-Saver-${todayString}.xlsx`);
    console.log(todayString);
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
                layout={layout}
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
