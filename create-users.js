const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) return;
  const key = trimmed.slice(0, eqIndex).trim();
  const value = trimmed.slice(eqIndex + 1).trim();
  if (!process.env[key]) process.env[key] = value;
});

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password@123', 10);

  const users = [
    {
      email: 'admin@uhil.com',
      phone: '+60100000001',
      name: 'Admin User',
      password,
      role: 'admin',
      status: 'active',
      isvarified: true,
      emailVerified: true,
      phoneVerified: true,
      onboarding: false,
    },
    {
      email: 'parent@uhil.com',
      phone: '+60100000002',
      name: 'Parent User',
      password,
      role: 'parent',
      status: 'active',
      isvarified: true,
      emailVerified: true,
      phoneVerified: true,
      onboarding: false,
    },
    {
      email: 'tutor@uhil.com',
      phone: '+60100000003',
      name: 'Tutor User',
      password,
      role: 'tutor',
      status: 'active',
      isvarified: true,
      emailVerified: true,
      phoneVerified: true,
      onboarding: false,
    },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (existing) {
      console.log(`User ${user.email} already exists, skipping.`);
      continue;
    }
    const created = await prisma.user.create({ data: user });
    console.log(`Created ${created.role}: ${created.email} (phone: ${created.phone})`);
  }

  console.log('\nAll users created. Login with:');
  console.log('  Password: Password@123');
  console.log('  Admin  phone: 0100000001');
  console.log('  Parent phone: 0100000002');
  console.log('  Tutor  phone: 0100000003');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
