// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class Editor {
  constructor() {
    const localData = localStorage.getItem('content');

    // Check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      console.warn('CodeMirror is not loaded. Displaying a fallback editor or message.');
      // You can display a fallback editor or a message to the user here
      return;
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // Load data from IndexedDB and set it in the editor
    this.loadData();
    
    this.editor.on('change', () => {
      // Update the local storage when the editor content changes
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content to IndexedDB when the editor loses focus
    this.editor.on('blur', async () => {
      console.log('The editor has lost focus');
      await this.saveData(this.editor.getValue());
    });
  }

  async loadData() {
    try {
      const data = await getDb();
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(data || localData || header);
    } catch (error) {
      console.error('Error loading data from IndexedDB:', error);
      // Handle the error, possibly by displaying a message to the user
    }
  }

  async saveData(content) {
    try {
      await putDb(content);
      console.log('Data saved to IndexedDB');
    } catch (error) {
      console.error('Error saving data to IndexedDB:', error);
      // Handle the error, possibly by displaying a message to the user
    }
  }
}
