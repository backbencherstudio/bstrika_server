import { Schema, model } from 'mongoose';
import { IPrivacyPolicy } from './privacyPolicy.interface';

const privacyPolicySchema = new Schema<IPrivacyPolicy>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const PrivacyPolicy = model<IPrivacyPolicy>('PrivacyPolicy', privacyPolicySchema);
