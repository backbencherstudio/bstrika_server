import { Schema, model } from 'mongoose';
import { ITermsAndConditions } from './termsAndConditions.interface';

const termsAndConditionsSchema = new Schema<ITermsAndConditions>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const TermsAndConditions = model<ITermsAndConditions>(
  'TermsAndConditions',
  termsAndConditionsSchema
);
