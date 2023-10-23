import { persistentAtom } from '@nanostores/persistent';
import Nostr from '../../utils/nostr';
import { secp256k1 } from '@noble/curves/secp256k1';
import { SimplePool, getPublicKey, nip19 } from 'nostr-tools';
import { MnemonicRegex, ProfileStoreKey, exporeFeedStoreKey, newExporeFeedStoreKey } from '../../const';
import { $key } from '../login.store';
import type { Profile } from '../profile.store';
import { defaultRelays } from '../../config';
import { DateTime } from 'luxon';

export interface FeedData {
  id: string;
  content: string;
  profile?: Profile;
}

export enum ExporeFeedEventType {
  ExporeFeedUpdate = 'expore-feed-update',
  NewExporeFeedUpdate = 'new-expore-feed-update',
}

export interface ExporeFeedEvent {
  type: ExporeFeedEventType;
  callback: (feedData: FeedData[]) => Promise<void> | void;
}

export const $exporeFeed = persistentAtom<FeedData[]>(exporeFeedStoreKey, [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const $newExporeFeed = persistentAtom<FeedData[]>(newExporeFeedStoreKey, [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function clearExporeFeed() {
  $exporeFeed.set([]);
  $newExporeFeed.set([]);
}

export async function startFetchAndSubscriptExporeFeed(feedEvent: ExporeFeedEvent[]) {
  clearExporeFeed();

  const dateTimeNow = DateTime.now();
  const events = await Nostr.getPool().list(defaultRelays, [
    {
      kinds: [1],
      since: Math.round(dateTimeNow.minus({ days: 1 }).toSeconds()),
      until: Math.round(dateTimeNow.toSeconds()),
      limit: 10,
    },
  ]);

  $exporeFeed.subscribe((feedUpdate) => feedEvent.find((it) => it.type == ExporeFeedEventType.ExporeFeedUpdate)?.callback([...feedUpdate]));
  for (const event of events) {
    $exporeFeed.set([
      ...$exporeFeed.get(),
      {
        id: event.id,
        content: event.content,
        profile: await Nostr.getProfile(event.pubkey),
      },
    ]);
  }

  const sub = Nostr.getPool().sub(defaultRelays, [{ kinds: [1], since: Math.round(dateTimeNow.toSeconds()) }]);
  sub.on('event', async (event) => {
    $newExporeFeed.set([
      {
        id: event.id,
        content: event.content,
        profile: await Nostr.getProfile(event.pubkey),
      },
      ...$newExporeFeed.get(),
    ]);

    await feedEvent.find((it) => it.type == ExporeFeedEventType.NewExporeFeedUpdate)?.callback($newExporeFeed.get());
  });
  $newExporeFeed.subscribe((feedUpdate) => feedEvent.find((it) => it.type == ExporeFeedEventType.NewExporeFeedUpdate)?.callback([...feedUpdate]));
}

export function updateNewFeedToExporeFeed() {
  $exporeFeed.set([...$newExporeFeed.get(), ...$exporeFeed.get()]);
  $newExporeFeed.set([]);
}

export async function getExporeFeed() {
  $exporeFeed.set([]);
  const events = await Nostr.getPool().list(defaultRelays, [{ kinds: [1], limit: 10 }]);

  let feed: FeedData[] = [];
  for (const event of events) {
    const profile = await Nostr.getProfile(event.pubkey);

    feed = [
      ...feed,
      {
        id: event.id,
        content: event.content,
        profile,
      },
    ];
  }
  $exporeFeed.set(feed);
}

export async function subExporeFeed() {
  $newExporeFeed.set([]);
  const sub = Nostr.getPool().sub(defaultRelays, [{ kinds: [1], since: Math.round(Date.now() / 1000) }]);
  sub.on('event', async (event) => {
    $newExporeFeed.set([
      {
        id: event.id,
        content: event.content,
        profile: await Nostr.getProfile(event.pubkey),
      },
      ...$newExporeFeed.get(),
    ]);
  });
}
