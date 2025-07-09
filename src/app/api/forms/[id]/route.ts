import dbConnect from '@/lib/mongoose';
import Form from '@/models/Form';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    const id = (await params).id


    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'ID không hợp lệ' }, { status: 400 });
    }

    try {
        const deleted = await Form.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ message: 'Không tìm thấy mẫu' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Xoá mẫu thành công' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Lỗi server', error: err }, { status: 500 });
    }
}