import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import fs from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { PDFDocument, rgb } from 'pdf-lib';

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
  const pdfDoc = await PDFDocument.load(new Uint8Array(buffer));

  return await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    //@ts-ignore
    useCompression: true
  });
}

async function createPDFPreview(buffer: Buffer) {
  try {
    // Load the PDF
    const pdfDoc = await PDFDocument.load(new Uint8Array(buffer));
    const pages = pdfDoc.getPages();
    if (pages.length === 0) {
      throw new Error('PDF has no pages');
    }

    // Get the first page
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Create a new PDF document with just the first page
    const previewDoc = await PDFDocument.create();
    const [copiedPage] = await previewDoc.copyPages(pdfDoc, [0]);
    previewDoc.addPage(copiedPage);

    // Save the single-page PDF
    const previewPdfBytes = await previewDoc.save();

    // Calculate dimensions maintaining aspect ratio
    const aspectRatio = width / height;
    let previewWidth = PDF_PREVIEW_WIDTH;
    let previewHeight = Math.round(previewWidth / aspectRatio);

    // Adjust if height exceeds maximum
    if (previewHeight > PDF_PREVIEW_HEIGHT) {
      previewHeight = PDF_PREVIEW_HEIGHT;
      previewWidth = Math.round(previewHeight * aspectRatio);
    }

    // Create temporary file path for the PDF preview
    const tempDir = join(process.cwd(), 'media', 'temp');
    await mkdir(tempDir, { recursive: true });
    const tempPdfPath = join(tempDir, `${uuidv4()}.pdf`);
    await fs.writeFile(tempPdfPath, previewPdfBytes);

    // Use pdftoppm or similar tool to convert PDF to image
    // For now, we'll create a placeholder preview
    const previewBuffer = await sharp({
      create: {
        width: previewWidth,
        height: previewHeight,
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

    // Clean up temporary file
    await fs.unlink(tempPdfPath);

    return previewBuffer;
  } catch (error) {
    console.error('Error creating PDF preview:', error);
    throw error;
  }
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

    try {
      if (file.type.startsWith('image/')) {
        // For images, create single optimized version
        buffer = await optimizeImage(buffer);
        uploadFileName = `${uniqueId}.jpg`; // Always save as jpg
        previewFileName = uploadFileName; // Use same file for preview

        // Save optimized image
        await writeFile(join(mediaDir, uploadFileName), new Uint8Array(buffer));
      } else if (file.type === 'application/pdf') {
        // For PDFs, we need both the optimized PDF and a preview image
        const optimizedPdf = await optimizePDF(buffer);
        const pdfPreview = await createPDFPreview(buffer);

        uploadFileName = `${uniqueId}.pdf`;
        previewFileName = `${uniqueId}_preview.jpg`;

        // Save both files
        await writeFile(join(mediaDir, uploadFileName), optimizedPdf);
        await writeFile(
          join(mediaDir, previewFileName),
          new Uint8Array(pdfPreview)
        );
      }

      return NextResponse.json({
        url: uploadFileName,
        previewUrl: previewFileName || uploadFileName
      });
    } catch (error) {
      console.error('Processing error:', error);
      throw new Error('Failed to process file');
    }
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
