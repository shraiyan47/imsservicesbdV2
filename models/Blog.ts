export interface Blog {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author?: string;
  tags: string[];
  metaTags: string[];
  metaDescription: string;
  featuredImage?: string;
  featured: boolean;
  order: number;
  published: boolean;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
