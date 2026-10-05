import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const hash  = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !hash) {
    console.log("Skipping admin seed — set ADMIN_EMAIL and ADMIN_PASSWORD_HASH to create one.");
    return;
  }
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: { email, passwordHash: hash, name: "Brian Mugambi Mbaabu", role: "ADMIN" }
  });
  console.log("Seeded admin:", email);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
