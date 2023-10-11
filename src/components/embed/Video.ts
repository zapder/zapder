import type Embed from './Embed';

const Video: Embed = {
  type: 'media',
  regex: /(https?:\/\/\S+?\.(?:mp4|webm|ogg|mov)(?:\?\S*)?)/gi,
  component: (match: string): string => {
    return `
        <video controls autoplay>
          <source src="${match}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      `;
  },
};

export default Video;
