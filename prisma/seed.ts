// // prisma/seed.ts

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   // Creating some roles and statuses
//   const roles = ['admin', 'student', 'parent', 'tutor'];
//   const statuses = ['active', 'disabled', 'pendingApproval'];

//   // Seed Users
//   const user1 = await prisma.user.create({
//     data: {
//       email: 'admin@example.com',
//       phone: '1234567890',
//       password: 'securepassword',
//       name: 'Admin User',
//       role: 'admin',
//       status: 'active',
//       onboarding: true,
//     },
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       email: 'tutor1@example.com',
//       phone: '0987654321',
//       password: 'securepassword',
//       name: 'Tutor One',
//       role: 'tutor',
//       status: 'active',
//       onboarding: true,
//       tutor: {
//         create: {
//           bio: 'Experienced Tutor in Mathematics',
//           experience: '5 years',
//           subjects: ['Math', 'Science'],
//         },
//       },
//     },
//   });

//   // Seed Subjects
//   const mathSubject = await prisma.subject.create({
//     data: {
//       name: 'Mathematics',
//     },
//   });

//   const scienceSubject = await prisma.subject.create({
//     data: {
//       name: 'Science',
//     },
//   });

//   // Seed Tutor Availability
//   const availability = await prisma.availability.createMany({
//     data: [
//       { day: 'Monday', startTime: '08:00 AM', endTime: '12:00 PM', tutorId: user2.tutor?.id ?? '' },
//       { day: 'Wednesday', startTime: '02:00 PM', endTime: '05:00 PM', tutorId: user2.tutor?.id ?? '' },
//     ],
//   });

//   // Seed Parent
//   const parent = await prisma.parent.create({
//     data: {
//       user: {
//         create: {
//           email: 'parent@example.com',
//           phone: '1122334455',
//           password: 'securepassword',
//           name: 'Parent One',
//           role: 'parent',
//           status: 'active',
//         },
//       },
//     },
//   });

//   // Seed Student
//   const student = await prisma.student.create({
//     data: {
//       email: 'student@example.com',
//       phone: '2233445566',
//       address: '123 Main St',
//       city: 'Example City',
//       state: 'Example State',
//       name: 'Student One',
//       school: 'Example High School',
//       studymode: 'Online',
//       level: 'Intermediate',
//       subject: ['Math', 'Science'],
//       class: '10th Grade',
//       sessionFrequency: '3 times a week',
//       sessionDuration: '1 hour',
//       age: '15',
//       sex: 'Male',
//       parent: { connect: { id: parent.id } },
//     },
//   });

//   // Seed Job
//   const job = await prisma.job.create({
//     data: {
//       userId: user2.id,
//       subject: 'Math',
//       mode: 'Online',
//       start: new Date(),
//       hourly: '30',
//       location: 'Remote',
//       studentLevel: 'Beginner',
//       requriments: 'Basic understanding of algebra',
//       studentName: 'Student One',
//       studentAge: '15',
//       dayAvailable: 'Monday, Wednesday',
//       timeRange: '9:00 AM - 10:00 AM',
//       hoursPerSession: '1',
//       sessionsPerWeek: '2',
//       sessionsPerMonth: '8',
//       status: 'in review',
//     },
//   });

//   // Seed Lesson
//   const lesson = await prisma.lesson.create({
//     data: {
//       description: 'Math session on algebra',
//       subject: 'Math',
//       date: new Date(),
//       startTime: new Date(),
//       endTime: new Date(),
//       tutorId: user2.id,
//       studentId: student.id,
//     },
//   });

//   // Seed Application
//   const application = await prisma.application.create({
//     data: {
//       tutorId: user2.id,
//       jobId: job.id,
//       coverLetter: 'I am very interested in teaching Math to this student.',
//     },
//   });

//   // Seed Invoice
//   const invoice = await prisma.invoice.create({
//     data: {
//       invoiceNumber: 'INV-1001',
//       date: new Date(),
//       parentId: parent.id,
//       studentId: student.id,
//       subtotal: 200.0,
//       sst: 10.0,
//       total: 210.0,
//       status: 'PENDING',
//     },
//   });

//   // Seed Payout
//   const payout = await prisma.payout.create({
//     data: {
//       tutorId: user2.id,
//       invoiceId: invoice.id,
//       totalEarning: 200.0,
//       payoutAmount: 180.0,
//       status: 'Pending',
//     },
//   });
// }

// main()
//   .then(() => {
//     console.log('Seed data created successfully');
//   })
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
