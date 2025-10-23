import prisma from "../src/shared/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@quickmeet.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
}

main().catch(console.error);
