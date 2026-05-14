import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { renderToBuffer } from '@react-pdf/renderer';
import { getReportCardById } from '@/action/reportCard';
import { ReportCardDocument } from '@/app/tutor-dashboard/report-card/components/report-card-document';
import type { ReportCardData } from '@/app/tutor-dashboard/report-card/components/report-card-preview';

export const runtime = 'nodejs';

const schema = z.object({
  id: z.string().min(1, 'Report card id is required')
});

let cachedLogo: string | null = null;
async function getLogoDataUri() {
  if (cachedLogo) return cachedLogo;
  try {
    const buf = await readFile(path.join(process.cwd(), 'public', 'logo.jpg'));
    cachedLogo = `data:image/jpeg;base64,${buf.toString('base64')}`;
  } catch {
    cachedLogo = null;
  }
  return cachedLogo;
}

const scoreToStr = (v: number | null | undefined) =>
  v === null || v === undefined ? '' : String(v);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid data' },
      { status: 422 }
    );
  }

  // getReportCardById enforces auth + ownership (tutor owns it, or admin).
  const card = await getReportCardById(parsed.data.id);
  if (!card) {
    return NextResponse.json(
      { error: 'Report card not found or access denied' },
      { status: 404 }
    );
  }

  const data: ReportCardData = {
    studentName: card.student?.name ?? '',
    level: card.level ?? '',
    subject: card.subject ?? '',
    classId: card.classId ?? '',
    teacherName: card.teacherName ?? card.tutor?.name ?? '',
    diagnostic: scoreToStr(card.diagnostic),
    q1: scoreToStr(card.q1),
    q2: scoreToStr(card.q2),
    q3: scoreToStr(card.q3),
    q4: scoreToStr(card.q4),
    remarks: card.remarks ?? ''
  };

  const logoSrc = (await getLogoDataUri()) ?? undefined;
  const buffer = await renderToBuffer(ReportCardDocument({ data, logoSrc }));

  const safeName =
    data.studentName.trim().replace(/[^a-z0-9]+/gi, '-') || 'student';
  const safeSubject =
    data.subject.trim().replace(/[^a-z0-9]+/gi, '-') || 'report';

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-card-${safeName}-${safeSubject}.pdf"`,
      'Cache-Control': 'no-store'
    }
  });
}
