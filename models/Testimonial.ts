export interface Testimonial {
  _id?: string;
  studentName: string;
  university: string;
  country: string;
  comment: string;
  image?: string;
  rating: number;
  date?: Date;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
