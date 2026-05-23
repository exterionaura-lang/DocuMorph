/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { openDB, IDBPDatabase } from 'idb';
import { ConvertedFile } from '../types';

const DB_NAME = 'documorph_db';
const STORE_NAME = 'documorph_files';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

export const getDB = (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const getStoredFiles = async (): Promise<ConvertedFile[]> => {
  try {
    const db = await getDB();
    const files = await db.getAll(STORE_NAME);
    // Sort youngest first
    return files.sort((a, b) => new Date(b.convertedAt).getTime() - new Date(a.convertedAt).getTime());
  } catch (error) {
    console.error('Failed to get files from IndexedDB:', error);
    return [];
  }
};

export const saveStoredFile = async (file: ConvertedFile): Promise<void> => {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, file);
  } catch (error) {
    console.error('Failed to save file to IndexedDB:', error);
    throw error;
  }
};

export const deleteStoredFile = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  } catch (error) {
    console.error('Failed to delete file from IndexedDB:', error);
    throw error;
  }
};

export const clearDatabaseData = async (): Promise<void> => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.objectStore(STORE_NAME).clear();
    await tx.done;
  } catch (error) {
    console.error('Failed to clear IndexedDB:', error);
    throw error;
  }
};
