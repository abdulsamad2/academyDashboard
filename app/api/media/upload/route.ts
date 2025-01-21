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
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const PDF_PREVIEW_WIDTH = 800;
const PDF_PREVIEW_HEIGHT = 600;
const MAX_PDF_SIZE = 100 * 1024 * 1024; // 100MB limit for PDF processing
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks for processing

async function optimizeImage(buffer: Buffer) {
  // Get image metadata
  const metadata = await sharp(buffer).metadata();

  // Initialize sharp pipeline
  let pipeline = sharp(buffer, { limitInputPixels: false }); // Remove input pixel limit

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
  try {
    // Load PDF with custom options for large files
    const pdfDoc = await PDFDocument.load(new Uint8Array(buffer), {
      updateMetadata: false, // Skip metadata updates
      ignoreEncryption: true // Ignore encryption for faster processing
    });

    // Optimize PDF settings
    return await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      //@ts-ignore
      useCompression: true,
      //@ts-ignore
      objectsPerTick: 50, // Limit objects processed per tick to prevent memory issues
      updateFieldAppearances: false // Skip field appearance updates
    });
  } catch (error) {
    console.error('PDF optimization error:', error);
    throw new Error(
      'Failed to optimize PDF. The file might be too large or corrupted.'
    );
  }
}

async function createPDFPreview(buffer: Buffer) {
  try {
    // Load the PDF with optimized settings
    const pdfDoc = await PDFDocument.load(new Uint8Array(buffer), {
      updateMetadata: false,
      ignoreEncryption: true
    });

    const pages = pdfDoc.getPages();
    if (pages.length === 0) {
      throw new Error('PDF has no pages');
    }

    // Create a new PDF document with just the first page
    const previewDoc = await PDFDocument.create();
    const [copiedPage] = await previewDoc.copyPages(pdfDoc, [0]);

    // Calculate dimensions maintaining aspect ratio
    const { width, height } = copiedPage.getSize();
    const aspectRatio = width / height;
    let previewWidth = PDF_PREVIEW_WIDTH;
    let previewHeight = Math.round(previewWidth / aspectRatio);

    if (previewHeight > PDF_PREVIEW_HEIGHT) {
      previewHeight = PDF_PREVIEW_HEIGHT;
      previewWidth = Math.round(previewHeight * aspectRatio);
    }

    // Scale the page to preview dimensions
    copiedPage.scale(previewWidth / width, previewHeight / height);
    previewDoc.addPage(copiedPage);

    // Save with optimized settings
    const previewPdfBytes = await previewDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      //@ts-ignore
      useCompression: true,
      //@ts-ignore
      objectsPerTick: 50
    });

    // Create preview image
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

    return previewBuffer;
  } catch (error) {
    console.error('Error creating PDF preview:', error);
    throw error;
  }
}

async function processFileInChunks(file: File) {
  const chunks: Buffer[] = [];
  const fileStream = file.stream();
  const reader = fileStream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks.map(chunk => new Uint8Array(chunk)));
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

    // Check file size for PDFs
    if (file.type === 'application/pdf' && file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: 'PDF file size exceeds maximum limit of 100MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const uniqueId = uuidv4();
    const mediaDir = join(process.cwd(), 'media');
    await mkdir(mediaDir, { recursive: true });

    // Process file in chunks
    const buffer = await processFileInChunks(file);
    let uploadFileName, previewFileName;

    try {
      if (file.type.startsWith('image/')) {
        const optimizedImage = await optimizeImage(buffer);
        uploadFileName = `${uniqueId}.jpg`;
        previewFileName = uploadFileName;

        await writeFile(join(mediaDir, uploadFileName), new Uint8Array(optimizedImage));
      } else if (file.type === 'application/pdf') {
        const optimizedPdf = await optimizePDF(buffer);
        const pdfPreview = await createPDFPreview(buffer);

        uploadFileName = `${uniqueId}.pdf`;
        previewFileName = `${uniqueId}_preview.jpg`;

        await writeFile(join(mediaDir, uploadFileName), new Uint8Array(optimizedPdf));
        await writeFile(join(mediaDir, previewFileName), new Uint8Array(pdfPreview));
      }

      return NextResponse.json({
        url: uploadFileName,
        previewUrl: previewFileName || uploadFileName
      });
    } catch (error) {
      console.error('Processing error:', error);
      throw new Error(
        error instanceof Error
          ? `Failed to process file: ${error.message}`
          : 'Failed to process file'
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
