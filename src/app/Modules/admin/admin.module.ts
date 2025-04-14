import { Schema, model } from 'mongoose';
import { TCategory } from './admin.interface';

const CategorySchema = new Schema<TCategory>(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
    subCategories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Category = model<TCategory>('Category', CategorySchema);
