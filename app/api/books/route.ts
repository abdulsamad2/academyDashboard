import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { ca } from 'date-fns/locale';
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const books = await db.book.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    
  try {
    const session = await auth();
    //@ts-ignore
    if (!session?.role === 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const book = await db.book.create({
      data: {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        pdfUrl: data.pdfUrl,
        category: data.category,
        level: data.level,
      }
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
