export default interface Embed {
  type: 'text' | 'media';
  regex: RegExp;
  component: (match: string) => string;
}
