import type Embed from './Embed';

const NewLine: Embed = {
  type: 'text',
  regex: /\n/gi,
  component: (match: string): string => {
    return `
        <br />
      `;
  },
};

export default NewLine;
