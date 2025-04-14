/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCategory } from "./admin.interface";
import { Category } from "./admin.module";

const createCategory = async (payload: TCategory) => {
  return await Category.create(payload);
};

const addSubCategory = async (
    categoryId: string,
    subCategory: { subCategories: string }
  ) => {
    return await Category.findByIdAndUpdate(
      { _id: categoryId },
      { $addToSet: { subCategories: subCategory.subCategories } },
      { new: true, runValidators: true }
    );
  };
  

const getAllCategories = async () => {
  return await Category.find();
};

const removeSubCategory = async (
  categoryId: string,
  subCategory: { subCategories: string }
) => {
  return await Category.findByIdAndUpdate(
    {_id : categoryId},
    { $pull: { subCategories: subCategory.subCategories } },
    { new: true }
  );
};


export const CategoryService = {
    createCategory,
    addSubCategory,
    getAllCategories,
    removeSubCategory,
}