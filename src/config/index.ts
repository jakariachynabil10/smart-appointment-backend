import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), '.env') });


export default {
     env: process.env.NODE_ENV,
    port: process.env.PORT,
     database_url: process.env.DATABASE_URL as string,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
}