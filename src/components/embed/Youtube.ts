import type Embed from './Embed';

const Youtube: Embed = {
  type: 'media',
  regex: /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})(?:\S+)?/g,
  component: (match: string): string => {
    const videoID = match.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];

    return `
      <iframe
        width="650"
        height="400"
        src="https://www.youtube.com/embed/${videoID}"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      `;
  },
};

export default Youtube;
