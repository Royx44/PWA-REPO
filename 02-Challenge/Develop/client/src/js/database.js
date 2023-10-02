import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  const db = await initdb();
  const tx = db.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  
  try {
    await store.add({ content });
    console.log('Data added to IndexedDB');
  } catch (error) {
    console.error('Error adding data to IndexedDB:', error);
  } finally {
    tx.done;
  }
};


// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const db = await initdb();
  const tx = db.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  
  try {
    const data = await store.getAll();
    console.log('Data retrieved from IndexedDB');
    return data;
  } catch (error) {
    console.error('Error retrieving data from IndexedDB:', error);
    return null;
  } finally {
    tx.done;
  }
};


initdb();
