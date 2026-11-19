import { describe, it, expect } from 'vitest';
import {
  AUTH_KEY,
  DEFAULT_MOCK_USER,
  STORAGE_KEY,
  createMockCloudClient,
  loadAuthUser,
  loadLocalProgress,
  saveAuthUser,
  toggleDayComplete,
  type StorageLike,
} from './progress';

function createMemoryStorage(seed: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(seed));
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => void store.set(k, v),
    removeItem: (k) => void store.delete(k),
  };
}

describe('progress', () => {
  it('guest mode: saves locally, does not touch cloud', async () => {
    const storage = createMemoryStorage();
    const cloud = createMockCloudClient({ isSignedIn: false });
    const result = await toggleDayComplete('day-12', true, { storage, cloud });
    expect(result).toEqual({ 'day-12': true });
    expect(storage.getItem(STORAGE_KEY)).toBe('{"day-12":true}');
    expect(cloud.remoteData).toEqual({});
  });

  it('signed-in: syncs to the mock cloud', async () => {
    const storage = createMemoryStorage();
    const cloud = createMockCloudClient({ isSignedIn: true, user: DEFAULT_MOCK_USER });
    await toggleDayComplete('day-13', true, { storage, cloud });
    expect(cloud.remoteData).toEqual({ 'day-13': true });
  });

  it('unchecking keeps other days', async () => {
    const storage = createMemoryStorage({
      [STORAGE_KEY]: JSON.stringify({ 'day-12': true, 'day-13': true }),
    });
    const cloud = createMockCloudClient();
    const result = await toggleDayComplete('day-12', false, { storage, cloud });
    expect(result).toEqual({ 'day-12': false, 'day-13': true });
  });

  it('malformed JSON loads as empty', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: '{not json' });
    expect(loadLocalProgress(storage)).toEqual({});
  });

  it('loadAuthUser returns null for malformed JSON; saveAuthUser(null) removes key', () => {
    const storage = createMemoryStorage({ [AUTH_KEY]: '{oops' });
    expect(loadAuthUser(storage)).toBeNull();
    saveAuthUser(DEFAULT_MOCK_USER, storage);
    expect(loadAuthUser(storage)).toEqual(DEFAULT_MOCK_USER);
    saveAuthUser(null, storage);
    expect(storage.getItem(AUTH_KEY)).toBeNull();
  });

  it('legacy data loads unchanged', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: '{"day-12":true}' });
    expect(loadLocalProgress(storage)).toEqual({ 'day-12': true });
  });
});
