import type Embed from './Embed';

const Image: Embed = {
  type: 'media',
  regex: /(https?:\/\/\S+?\.(?:png|jpg|jpeg|gif|svg|webp)(?:\?\S*?)?)/gi,
  component: (match: string): string => {
    return `
        <img src=${match} />
      `;
  },
};

export default Image;
