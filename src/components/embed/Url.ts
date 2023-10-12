import type Embed from './Embed';
import Image from './Image';
import Video from './Video';

const ignoreRegexs = [Image, Video];

const Url: Embed = {
  type: 'text',
  regex: /(https?:\/\/[^\s,\\.]+(?:\.[^\s,.]+)*)/g,
  component: (match: string): string => {
    if (ignoreRegexs.some((it) => match.match(it.regex))) return match;

    return `
        <a href="${match}" target="_bank">
          <span class="text-[#0066CC] hover:underline">${match}</span>
        </a>
      `;
  },
};

export default Url;
