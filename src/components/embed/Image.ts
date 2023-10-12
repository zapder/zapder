import type Embed from './Embed';

const Image: Embed = {
  type: 'media',
  regex: /(https?:\/\/\S+?\.(?:png|jpg|jpeg|gif|svg|webp)(?:\?\S*?)?)/gi,
  component: (match: string): string => {
    return `
        <img class="mt-3" src=${match} />
      `;
  },
};

export default Image;
