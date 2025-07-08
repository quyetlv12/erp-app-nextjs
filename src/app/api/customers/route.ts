import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Customer from '@/models/Customer';

export async function GET(req: NextRequest) {
  await dbConnect();

  // Lấy query params cho phân trang
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const skip = (page - 1) * limit;

  // Lấy tổng số lượng bản ghi
  const total = await Customer.countDocuments();

  // Lấy dữ liệu phân trang
  const customers = await Customer.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return NextResponse.json({
    data: customers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const customer = await Customer.create(data);

  return NextResponse.json(customer.toObject(), { status: 201 });
}
