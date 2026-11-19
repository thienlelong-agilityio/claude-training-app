export const STORAGE_KEY = 'training_progress';
export const AUTH_KEY = 'training_auth_user';

export type LegacyProgressMap = Record<string, boolean>;

export interface MockUser {
  name: string;
  email: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

export interface CloudClientLike {
  isSignedIn: boolean;
  user: MockUser | null;
  remoteData: LegacyProgressMap;
  fetchAll(): Promise<LegacyProgressMap | null>;
  saveAll(data: LegacyProgressMap): Promise<boolean>;
}

export const DEFAULT_MOCK_USER: MockUser = { name: 'Learner', email: 'learner@example.com' };

function getDefaultStorage(): StorageLike | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
}

/** Factory so tests get a fresh, isolated client. */
export function createMockCloudClient(
  initial?: Partial<Pick<CloudClientLike, 'isSignedIn' | 'user' | 'remoteData'>>,
): CloudClientLike {
  const client: CloudClientLike = {
    isSignedIn: initial?.isSignedIn ?? false,
    user: initial?.user ?? null,
    remoteData: initial?.remoteData ? { ...initial.remoteData } : {},
    async fetchAll() {
      return client.isSignedIn ? { ...client.remoteData } : null;
    },
    async saveAll(data) {
      if (!client.isSignedIn) return false;
      client.remoteData = { ...data };
      return true;
    },
  };
  return client;
}

/** App-wide default in-memory mock client. */
export const mockCloudClient: CloudClientLike = createMockCloudClient();

export function loadLocalProgress(storage?: StorageLike): LegacyProgressMap {
  const store = storage ?? getDefaultStorage();
  if (!store) return {};
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    const result: LegacyProgressMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === 'boolean') result[key] = value;
    }
    return result;
  } catch {
    return {};
  }
}

export function saveLocalProgress(data: LegacyProgressMap, storage?: StorageLike): void {
  const store = storage ?? getDefaultStorage();
  if (!store) return;
  store.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadAuthUser(storage?: StorageLike): MockUser | null {
  const store = storage ?? getDefaultStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { name, email } = parsed as Record<string, unknown>;
    if (typeof name !== 'string' || typeof email !== 'string') return null;
    return { name, email };
  } catch {
    return null;
  }
}

export function saveAuthUser(user: MockUser | null, storage?: StorageLike): void {
  const store = storage ?? getDefaultStorage();
  if (!store) return;
  if (user === null) {
    if (store.removeItem) store.removeItem(AUTH_KEY);
    else store.setItem(AUTH_KEY, '');
    return;
  }
  store.setItem(AUTH_KEY, JSON.stringify(user));
}

export async function toggleDayComplete(
  dayId: string,
  isCompleted: boolean,
  deps?: { storage?: StorageLike; cloud?: CloudClientLike },
): Promise<LegacyProgressMap> {
  const storage = deps?.storage;
  const cloud = deps?.cloud;
  const current = loadLocalProgress(storage);
  current[dayId] = Boolean(isCompleted);
  saveLocalProgress(current, storage);
  if (cloud?.isSignedIn) {
    await cloud.saveAll(current);
  }
  return current;
}
