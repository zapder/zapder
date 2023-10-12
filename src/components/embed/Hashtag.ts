import type Embed from './Embed';

const Hashtag: Embed = {
  type: 'text',
  regex: /(?:\s|^)(#\w+)/g,
  component: (match: string): string => {
    return `
        <span class="text-blue-600">${match}</span>
      `;
  },
};

export default Hashtag;
