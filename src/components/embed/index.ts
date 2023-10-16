import NewLine from './NewLine';
import Image from './Image';
import Video from './Video';
import Hashtag from './Hashtag';
import Url from './Url';
import Youtube from './Youtube';

const allEmbeds = [NewLine, Hashtag, Url, Image, Video, Youtube];

export const replaceEmbed = (content: string) => {
  let resContent = content;

  allEmbeds.forEach((embed) => {
    resContent = resContent.replace(embed.regex, embed.component);
  });

  return resContent;
};

export default allEmbeds;
