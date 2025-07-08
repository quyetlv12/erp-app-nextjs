import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  code: string;
  inCharge: string;
  type: string;
  name: string;
  taxCode: string;
  businessLicenseDate: string;
  representative: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

const CustomerSchema: Schema = new Schema(
  {
    code: { type: String, required: true },
    inCharge: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    taxCode: { type: String, required: true },
    businessLicenseDate: { type: String, required: true },
    representative: { type: String, required: true },
    position: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    createdBy: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Customer ||
  mongoose.model<ICustomer>('Customer', CustomerSchema);
