import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await dbConnect();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Vui lòng nhập email và mật khẩu' }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'Tài khoản không tồn tại' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: 'Mật khẩu không đúng' }, { status: 401 });
  }

  // Tạo JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  // Trả về response + set cookie
  const response = NextResponse.json({
    message: 'Đăng nhập thành công',
    user: { name: user.name, email: user.email },
    token,
  });

  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
