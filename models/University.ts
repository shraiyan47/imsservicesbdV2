export interface University {
  _id?: string;
  name: string;
  country: string;
  image: string;
  description: string;
  website?: string;
  subjects: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: {
    ielts?: number;
    duolingo?: number;
    toefl?: number;
    gre?: number;
  };
  acceptanceRate?: number;
  ranking?: number;
  featuredPrograms?: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
