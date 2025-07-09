import mongoose, { Schema, Document } from 'mongoose';

export interface IForm extends Document {
  name: string;
  placeholders: string[];
  createdAt?: Date;
  updatedAt?: Date;
  file_link?: string;
  createdBy?: string
}

const FormSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    placeholders: { type: [String], default: [] },
    file_link: { type: String, required: true },
    createdBy: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema); 