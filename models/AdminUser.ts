export interface AdminUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
