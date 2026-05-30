import { Gender, UserStatus } from "@/types/doctor.types";

export type { Gender, UserStatus };

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  profilePhoto?: string;
  isDeleted?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IPatient {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  gender: Gender;
  createdAt: Date;
  user: {
    status: UserStatus;
  };
}

export interface IPatientUserDetails {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  emailVerified?: boolean;
  isDeleted?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IPatientAppointmentItem {
  id?: string;
  status?: string;
  createdAt?: string | Date;
  doctor?: {
    id?: string;
    name?: string;
    email?: string;
    profilePhoto?: string;
    designation?: string;
    currentWorkingPlace?: string;
  };
  schedule?: {
    id?: string;
    startDateTime?: string | Date;
    endDateTime?: string | Date;
  };
}

export interface IPatientDetails extends Omit<IPatient, "user"> {
  user: IPatientUserDetails;
  appointments?: IPatientAppointmentItem[];
}
