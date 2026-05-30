export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  profilePhoto?: string;
  address?: string;
  isDeleted?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user: {
    status: UserStatus;
  };
}
