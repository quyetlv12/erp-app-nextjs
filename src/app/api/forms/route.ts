import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/mongoose';
import Customer from '@/models/Customer';
import Form from '@/models/Form';
import formidable, { Fields, Files } from 'formidable';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  await dbConnect();
  const forms = await Form.find().sort({ createdAt: -1 });
  return NextResponse.json({ data: forms });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();

  const file = formData.get('file') as File;
  const name = formData.get('name')?.toString() || '';
  const createdBy = formData.get('createdBy')?.toString() || '';
  const placeholders = formData.get('placeholders')?.toString() || '[]';
  const placeholdersArr = JSON.parse(placeholders);

  let file_link = '';

  if (file) {
    // 1. Đọc buffer từ file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Tạo tên file tạm trong /tmp hoặc /uploads
    const uploadsDir = join(process.cwd(), 'tmp');
    await mkdir(uploadsDir, { recursive: true });
    const fileName = Date.now() + '-' + file.name;
    const filePath = join(uploadsDir, fileName);

    // 3. Ghi file ra disk
    await writeFile(filePath, buffer);

    // 4. Upload file lên Cloudinary từ path
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: 'forms',
      resource_type: 'raw', 
      use_filename: true,
       format: 'txt'
    });

    file_link = uploadResult.secure_url;
  }

  // 5. Lưu form vào DB
  const newForm = await Form.create({
    name,
    placeholders: placeholdersArr,
    file_link,
    createdBy
  });
  return NextResponse.json(newForm, { status: 201 });
}
