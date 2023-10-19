import { persistentAtom } from '@nanostores/persistent';
import Nostr from '../utils/nostr';
import { secp256k1 } from '@noble/curves/secp256k1';
import { getPublicKey, nip19 } from 'nostr-tools';

export interface Profile {
  name?: string;
  display_name?: string;
  picture?: string;
}

export interface Key {
  rpub: string;
  priv?: string;
}

export const $profile = persistentAtom<Profile | undefined>('zapder.profile', undefined, {
  encode: JSON.stringify,
  decode: JSON.parse,
});
export const $key = persistentAtom<Key | undefined>('zapder.key', undefined, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export async function login(pk: string): Promise<Profile | undefined> {
  try {
    let key: Key;

    if (secp256k1.utils.isValidPrivateKey(pk)) {
      key = { priv: pk, rpub: getPublicKey(pk) };
    } else {
      const { type, data } = nip19.decode(pk);
      if (type == 'npub') {
        key = { rpub: data };
      } else if (type == 'nsec') {
        key = { priv: data, rpub: getPublicKey(data) };
      } else {
        return undefined;
      }
    }

    const profile = await Nostr.getProfile(key.rpub);

    $key.set(key);
    $profile.set(profile);

    return profile;
  } catch (err) {
    return undefined;
  }
}

export function logout() {
  $key.set(undefined);
  $profile.set(undefined);
}

export async function checkLogin(): Promise<Profile | undefined> {
  const key = $key.get();
  if (!key?.priv) return undefined;

  return $profile.get() || (await login(key.priv));
}
