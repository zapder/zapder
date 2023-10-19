import type Embed from '../Embed';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Nostr from '../../../utils/nostr';

const NostrProfile: Embed = {
  type: 'text',
  regex: /(?:^|\s|nostr:)+((?:@)?npub[a-zA-Z0-9]{59,60})(?![\w/])/gi,
  component: (match: string): string => {
    return `
      <profile-name npub=${match}></profile-name>
      `;
  },
};

@customElement('profile-name')
class ProfileName extends LitElement {
  @property({ type: String })
  public npub: string = '';

  @state()
  private profileName: string = '';

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  connectedCallback() {
    super.connectedCallback();

    (async () => {
      const profile = await Nostr.getProfile(this.npub);
      this.profileName = profile ? `@${profile.display_name || profile.name}` : '';
    })();
  }

  render() {
    return (
      this.profileName &&
      html`
        <span class="text-[#0066CC] hover:underline">
          <a href="/"> ${this.profileName} </a>
        </span>
      `
    );
  }
}

export default NostrProfile;
