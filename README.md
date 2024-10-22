<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>Tution Academy Admin Panel (Work In Progress)</strong></div>
<div align="center">Actively being developed by Abdul Samad</div>
<br />
<div align="center">
<a href="#">View Demo</a>
<span>
</div>

## Overview

This is a work-in-progress admin panel for a tuition academy, currently being built using the following tech stack:

- Framework - [Next.js 14](https://nextjs.org/14)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Auth - [Auth.js](https://authjs.dev/)
- File Uploading - [Uploadthing](https://uploadthing.com)
- Tables - [Tanstack Tables](https://ui.shadcn.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

_This project is being developed by Abdul Samad, a passionate React developer in the chemical industry, using advanced web technologies to streamline education administration._

## Pages

| Pages                                                                | Specifications                                                                                          |
| :------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| [Signup](#)                                                          | Authentication using **NextAuth** with support for social logins and email logins.                       |
| [Dashboard](#)                                                       | Cards with charts for academy analytics.                                                                |
| [Users](#)                                                           | Tanstack tables with client-side searching, pagination, and user management.                             |
| [Users/new](#)                                                       | User form with file uploading support using Uploadthing's dropzone.                                      |
| [Employee](#)                                                        | Tanstack tables with server-side searching, pagination, and employee details.                            |
| [Profile](#)                                                         | Multi-step dynamic forms with validation using react-hook-form and Zod.                                  |
| [Kanban Board](#)                                                    | Task management board with drag-and-drop functionality, built with dnd-kit and Zustand for local state.  |
| [Not Found](#)                                                       | Custom 404 Not Found page.                                                                               |
| -                                                                    | -                                                                                                       |

## Getting Started

Follow these steps to clone the repository and start the development server:

- `git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git`
- `npm install`
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- `npm run dev`

You should now be able to access the application at http://localhost:3000.
