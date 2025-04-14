import { Schema, model } from 'mongoose';
import { TCategory } from './admin.interface';

const CategorySchema = new Schema<TCategory>(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
    subCategories: [
      {
        categoryImage: { type: String },
        subCategory: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Category = model<TCategory>('Category', CategorySchema);
