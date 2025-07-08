import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Customer from '@/models/Customer';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const customer = await Customer.findById(params.id);
  if (!customer) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await req.json();
  const customer = await Customer.findByIdAndUpdate(params.id, data, { new: true });
  if (!customer) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(customer);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const customer = await Customer.findByIdAndDelete(params.id);
  if (!customer) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: 'Deleted' });
} 