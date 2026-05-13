import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const NEW_PASSWORD = 'Admin@1234';

const admins = await prisma.user.findMany({
  where: { role: 'admin' },
  select: {
    id: true,
    name: true,
    email: true,
    phone: true,
    status: true,
    isvarified: true,
    onboarding: true,
    createdAt: true
  },
  orderBy: { createdAt: 'asc' }
});

console.log(`\nFound ${admins.length} admin user(s):\n`);
for (const a of admins) {
  console.log(
    `- ${a.name ?? '<no name>'} | ${a.email} | ${a.phone} | status=${a.status} verified=${a.isvarified}`
  );
}

if (admins.length === 0) {
  const hashed = await bcrypt.hash(NEW_PASSWORD, 12);
  const created = await prisma.user.create({
    data: {
      email: 'admin@uhilacademy.com',
      phone: '+60123456789',
      password: hashed,
      name: 'Admin',
      role: 'admin',
      status: 'active',
      isvarified: true,
      emailVerified: true,
      phoneVerified: true,
      onboarding: false,
      otp: '',
      token: ''
    }
  });
  console.log('\nNo admin existed — created one:');
  console.log(`  phone:    ${created.phone}`);
  console.log(`  password: ${NEW_PASSWORD}`);
} else {
  const target = admins[0];
  const hashed = await bcrypt.hash(NEW_PASSWORD, 12);
  await prisma.user.update({
    where: { id: target.id },
    data: {
      password: hashed,
      status: 'active',
      isvarified: true,
      emailVerified: true,
      phoneVerified: true,
      onboarding: false
    }
  });
  console.log(`\nReset password for admin: ${target.email}`);
  console.log(`  phone:    ${target.phone}`);
  console.log(`  password: ${NEW_PASSWORD}`);
}

await prisma.$disconnect();
console.log('\nLog in at /auth/signin with the credentials above.');
