import { persistentAtom } from '@nanostores/persistent';
import Nostr from '../utils/nostr';
import { secp256k1 } from '@noble/curves/secp256k1';
import { getPublicKey, nip19 } from 'nostr-tools';
import { MnemonicRegex, ProfileStoreKey } from '../const';
import { $key } from './login.store';

export interface Profile {
  name?: string;
  display_name?: string;
  picture?: string;
}

export const $profile = persistentAtom<Profile | undefined>(ProfileStoreKey, undefined, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export async function getProfile(): Promise<Profile | undefined> {
  let profile = $profile.get();
  if (profile) return profile;

  const key = $key.get();
  if (!key) return undefined;

  profile = await Nostr.getProfile(key.rpub);
  if (!profile) return undefined;

  $profile.set(profile);
  return profile;
}
