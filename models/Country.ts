export interface Country {
  _id?: string;
  name: string;
  title: string;
  image: string;
  description?: string;
  tag?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
