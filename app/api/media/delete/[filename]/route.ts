// app/api/media/delete/[filename]/route.ts
import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { auth } from '@/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filename = params.filename;

    // File path in single media directory
    const filePath = join(process.cwd(), 'media', filename);

    try {
      await unlink(filePath);
      console.log(`Successfully deleted file: ${filename}`);
    } catch (error) {
      console.error(`Error deleting file: ${filename}`, error);
      return NextResponse.json(
        { error: 'File deletion failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
