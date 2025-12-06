export interface Partner {
  _id?: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
