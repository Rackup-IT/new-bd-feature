// PostModelRequest only use in validation file not in other file
export interface PostReqeustModel {
  id: string;
  title: string;
  section: string;
  writter: string;
  desscription: string;
  keywords: string[];
  image: FileList;
  content: string;
  edition: string;
  status: string;
}
export interface PostResponseModel {
  id: string;
  title: string;
  section: string;
  writter: string;
  desscription: string;
  keywords: string[];
  image: string;
  content: string;
  edition: string;
  status: string;
}

export interface TabSection {
  id: string;
  title: string;
  href: string;
  edition: string;
}
