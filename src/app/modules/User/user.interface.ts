export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: any; // multer file
}