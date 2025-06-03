/* eslint-disable no-undef */
import path from "path";
import fs from "fs"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCategory } from "./admin.interface";
import { Category } from "./admin.module";
import { Exchange } from "../shared/shared.module";

const createCategory = async (payload: TCategory) => {
  return await Category.create(payload);
};

const updateCategory = async (categoryId : string, payload: TCategory) => {
  return await Category.findByIdAndUpdate({_id : categoryId}, payload, {runValidators : true, new : true});
};


const addSubCategory = async (
    categoryId: string,
    subCategoryData: { subCategory: string; categoryImage: string }
  ) => {    
    const category = await Category.findById({_id : categoryId});  
    if (!category) throw new Error("Category not found");  
    const isDuplicate = category.subCategories.some(
      (item) =>
        item?.subCategory?.toLowerCase() === subCategoryData?.subCategory.toLowerCase()
    );  
    if (isDuplicate) {
      throw new Error("Subcategory already exists");
    }  
    category.subCategories.push(subCategoryData);
    const updatedCategory = await category.save();  
    return updatedCategory;
  };
  

  
const getAllCategories = async () => {
  return await Category.find();
};

const deleteCategoriesByAdmin = async (categoryId : string)=>{
  const result = await Category.findByIdAndDelete({_id : categoryId})
  return result
}

const getAbsoluteFilePath = (dbPath: string) => {
  try {
    const relativePath = dbPath
      .replace(/^\//, '')
      .replace(/^uploads\//, '');
    const uploadsDir = path.join(__dirname, '..', '..', '..', '..', '/uploads');
    return path.join(uploadsDir, relativePath);
  } catch (error) {
    console.error('Error constructing file path:', error);
    return null;
  }
};

const deleteFile = (filePath: string) => {
  try {
    if (!filePath) {
      console.error('Error: File path is undefined or null.');
      return false;
    }
    const normalizedPath = path.normalize(filePath);
    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
      return true;
    } else {
      console.warn(`File not found: ${normalizedPath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
    return false;
  }
};

const removeSubCategory = async (
    categoryId: string,
    subCategoryId: string
  ) => {
    const categoryData = await Category.findById(categoryId).select("subCategories");
  
    if (!categoryData) throw new Error("Category not found");
  
    const subCategoryObj = categoryData.subCategories.find(
      (item) => item._id.toString() === subCategoryId
    );
  
    if (!subCategoryObj) throw new Error("Subcategory not found");
  
    const imagePath = subCategoryObj.categoryImage;
  
    const absolutePath = getAbsoluteFilePath(imagePath);
    
    if (absolutePath) {
      deleteFile(absolutePath);
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        $pull: {
          subCategories: { _id: subCategoryId },
        },
      },
      { new: true, runValidators : true }
    );
  
    return updatedCategory;
  };

  const getAllExchangeDataFromDBbyAdmin = async () =>{

    const exchangeData = await Exchange.find({reciverUserAccepted: true, senderUserAccepted : true  }).populate([{
      path: 'senderUserId',
      select: 'first_name image email personalInfo'
    },
    {
      path: 'reciverUserId',
      select: 'first_name image email personalInfo'
    }])

    const acceptedData = await Exchange.find({isAccepted : true})
    
    
    return {exchangeData, acceptedData}
  }

   


export const CategoryService = {
    createCategory,
    updateCategory,
    addSubCategory,
    getAllCategories,
    deleteCategoriesByAdmin,
    removeSubCategory,
    getAllExchangeDataFromDBbyAdmin
}