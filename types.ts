export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  sources?: Source[];
}

export interface FaqItem {
  question: string;
  answer: string;
}