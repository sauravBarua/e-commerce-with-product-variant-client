export interface IAdmin {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  isDeleted?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IUpdateAdminPayload {
  admin?: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
}
