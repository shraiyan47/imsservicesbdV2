export interface StudentSubmission {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  destinationCountries: string[];
  subjects: string[];
  qualifications: string;
  ielts?: number;
  duolingo?: number;
  budget?: number;
  additionalInfo?: string;
  submittedAt: Date;
  read: boolean;
}
