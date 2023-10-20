import { persistentAtom } from '@nanostores/persistent';
import { getPublicKey, nip19 } from 'nostr-tools';
import { $profile } from './profile.store';
import { LoginStoreKey } from '../const';

export interface Key {
  rpub: string;
  priv?: string;
}

export const $key = persistentAtom<Key | undefined>(LoginStoreKey, undefined, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export async function login(keyStr: string): Promise<boolean> {
  let key: Key;

  if (keyStr.startsWith('nsec')) {
    try {
      const { type, data } = nip19.decode(keyStr);
      if (type !== 'nsec') return false;
      key = { priv: data, rpub: getPublicKey(data) };
      $key.set(key);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
    // } else if (keyStr.match(MnemonicRegex)?.length === 24) {
  } else if (keyStr.length === 64) {
    try {
      key = { priv: keyStr, rpub: getPublicKey(keyStr) };
      $key.set(key);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // public key logins
  if (keyStr.startsWith('npub')) {
    key = { rpub: keyStr };
    $key.set(key);
    return true;
  }

  return false;
}

export function logout() {
  $key.set(undefined);
  $profile.set(undefined);
}

export function checkLogin(): boolean {
  return !!$key.get();
}
