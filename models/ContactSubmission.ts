export interface ContactSubmission {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: Date;
  read: boolean;
}
