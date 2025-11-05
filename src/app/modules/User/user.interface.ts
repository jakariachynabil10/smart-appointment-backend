import { Role } from "../../../../generated/prisma";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: any; // multer file
}


export type IAuthUser = {
    email: string;
    role: Role
} | null;