import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FeedData } from '../stores/feed/exporeFeed.store';

@customElement('new-coming-feed')
class NewComingFeed extends LitElement {
  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  @property({ attribute: 'new-feed-data' }) private newFeedData: FeedData[] = [];

  render() {
    return this.newFeedData.length != 0
      ? html`
          <div class="flex justify-center items-center cursor-pointer">
            <div class="flex -space-x-4">
              ${this.newFeedData
                .slice(0, 4)
                .map(
                  (it, index) => html`
                    <img class="w-8 h-8 border-2 border-white rounded-full dark:border-gray-800" src="${it.profile?.picture}" alt="" />
                  `,
                )}
              ${this.newFeedData.slice(4).length > 0
                ? html`
                    <div
                      visible=${this.newFeedData.slice(4).length != 0}
                      class="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                    >
                      +${this.newFeedData.slice(4).length}
                    </div>
                  `
                : undefined}
            </div>
            <div class="flex items-center"><img class="w-8" src="/svg/up.svg" /><span>New posts</span></div>
          </div>
        `
      : undefined;
  }
}
