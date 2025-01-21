import { NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import { join } from 'path';
import { auth } from '@/auth';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get file metadata from database to check permissions
    // const upload = await prisma.upload.findFirst({
    //   where: { fileName: params.filename }
    // });

    // if (!upload) {
    //   return NextResponse.json({ error: 'File not found' }, { status: 404 });
    // }

    // Check if user has access (admin or file owner)
    // if (session.user.role !== 'admin' && upload.userId !== session.user.id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Serve the file
    const filePath = join(process.cwd(), 'uploads', params.filename);
    const stream = createReadStream(filePath);

    // Determine content type based on file extension
    const ext = params.filename.split('.').pop()?.toLowerCase();
    const contentType =
      {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif'
      }[ext || ''] || 'application/octet-stream';

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
