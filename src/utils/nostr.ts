import { SimplePool, nip19 } from 'nostr-tools';
import { defaultRelays } from '../config';

export default class Nastr {
  private static pool: SimplePool = new SimplePool();

  static getPool(): SimplePool {
    return this.pool;
  }

  static async getProfile(npub: string): Promise<Profile | undefined> {
    let pk: string = npub;
    try {
      const { type, data } = nip19.decode(npub);
      if (type != 'npub') return undefined;
      pk = data;
    } catch (err) {
      /* empty */
    }

    try {
      const kind0Data = await this.pool.get(defaultRelays, { kinds: [0], authors: [pk] });
      return kind0Data && JSON.parse(kind0Data.content);
    } catch (err) {
      return undefined;
    }
  }
}

export interface Profile {
  name?: string;
  display_name?: string;
  picture?: string;
}
