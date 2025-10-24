import { Role } from "../generated/prisma";
import prisma from "../src/shared/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

 const superAdmin =  await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@quickmeet.com",
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  console.log(superAdmin)
}

main().catch(console.error);
