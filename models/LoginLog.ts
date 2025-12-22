export interface LoginLog {
  _id?: string;
  adminId: string;
  email: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  reason?: string;
}
