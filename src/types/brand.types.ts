export interface IBrand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  isDeleted?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
