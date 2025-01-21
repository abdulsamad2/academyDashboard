import { auth } from "@/auth";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Similar permission checks as above

    const filePath = join(process.cwd(), 'media', 'previews', params.filename);
    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'private, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error serving preview:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
