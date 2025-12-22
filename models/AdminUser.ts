export interface AdminUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
  permissions: string[];
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
