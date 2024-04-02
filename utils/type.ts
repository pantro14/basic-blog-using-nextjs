export interface PostDetail {
  title: string;
  slug: string;
  meta: string;
  tags: string[];
  thumbnail: string;
  createdAt: string;
}

export interface IncomingPost {
  title: string;
  content: string;
  meta: string;
  slug: string;
  tags: string;
}
