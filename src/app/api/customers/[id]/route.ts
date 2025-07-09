import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Customer from '@/models/Customer';
import mongoose from 'mongoose';



export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  // Kiểm tra ID hợp lệ
  const id = params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'ID không hợp lệ' }, { status: 400 });
  }

  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json({ message: 'Không tìm thấy khách hàng' }, { status: 404 });
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi lấy khách hàng:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  // Kiểm tra ID hợp lệ
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const data = await req.json();

    // Validate sơ bộ
    if (!data.name || !data.code || !data.type) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(params.id, data, {
      new: true,
    });

    if (!updatedCustomer) {
      return NextResponse.json({ message: 'Không tìm thấy khách hàng' }, { status: 404 });
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Update customer error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}



export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;

  // Kiểm tra ID có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'ID không hợp lệ' }, { status: 400 });
  }

  try {
    const deleted = await Customer.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: 'Không tìm thấy khách hàng' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Xoá khách hàng thành công' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Lỗi server', error: err }, { status: 500 });
  }
}