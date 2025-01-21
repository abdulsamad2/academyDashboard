import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { auth } from '@/auth';

// Unified compression settings
const IMAGE_QUALITY = 80;
const MAX_WIDTH = 1200; // Reduced to be suitable for both storage and preview
const MAX_HEIGHT = 1200;
const PDF_PREVIEW_WIDTH = 800;
const PDF_PREVIEW_HEIGHT = 600;

async function optimizeImage(buffer: Buffer) {
  // Get image metadata
  const metadata = await sharp(buffer).metadata();

  // Initialize sharp pipeline
  let pipeline = sharp(buffer);

  // Only resize if image is larger than max dimensions
  if (metadata.width && metadata.height) {
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
  }

  // Optimize based on original format
  if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
    return pipeline
      .jpeg({
        quality: IMAGE_QUALITY,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer();
  } else if (metadata.format === 'png') {
    return pipeline
      .png({
        progressive: true,
        compressionLevel: 9,
        palette: true
      })
      .toBuffer();
  } else if (metadata.format === 'webp') {
    return pipeline
      .webp({
        quality: IMAGE_QUALITY,
        effort: 6
      })
      .toBuffer();
  } else {
    // For other formats, convert to JPEG
    return pipeline
      .jpeg({
        quality: IMAGE_QUALITY,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer();
  }
}

async function optimizePDF(buffer: Buffer) {
  const pdfDoc = await PDFDocument.load(buffer);

  return await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    //@ts-ignore
    useCompression: true
  });
}

async function createPDFPreview(buffer: Buffer) {
  const pdfDoc = await PDFDocument.load(buffer);
  const firstPage = pdfDoc.getPages()[0];
  const { width, height } = firstPage.getSize();

  return await sharp({
    create: {
      width: Math.min(PDF_PREVIEW_WIDTH, width),
      height: Math.min(PDF_PREVIEW_HEIGHT, height),
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .jpeg({
      quality: IMAGE_QUALITY,
      progressive: true,
      mozjpeg: true
    })
    .toBuffer();
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate unique filename
    const uniqueId = uuidv4();
    const originalExt = file.name.split('.').pop()?.toLowerCase();

    // Create media directory
    const mediaDir = join(process.cwd(), 'media');
    await mkdir(mediaDir, { recursive: true });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let uploadFileName, previewFileName;

    if (file.type.startsWith('image/')) {
      // For images, create single optimized version
      buffer = await optimizeImage(buffer);
      uploadFileName = `${uniqueId}.jpg`; // Always save as jpg
      previewFileName = uploadFileName; // Use same file for preview

      // Save optimized image
      await writeFile(join(mediaDir, uploadFileName), buffer);
    } else if (file.type === 'application/pdf') {
      // For PDFs, we need both the optimized PDF and a preview image
      const optimizedPdf = await optimizePDF(buffer);
      const pdfPreview = await createPDFPreview(buffer);

      uploadFileName = `${uniqueId}.pdf`;
      previewFileName = `${uniqueId}_preview.jpg`;

      // Save both files
      await writeFile(join(mediaDir, uploadFileName), optimizedPdf);
      await writeFile(join(mediaDir, previewFileName), pdfPreview);
    }

    return NextResponse.json({
      url: uploadFileName,
      previewUrl: previewFileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
