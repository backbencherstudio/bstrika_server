
import { Category } from "../admin/admin.module";
import { User } from "../User/user.model";

export const findUsersBasedOnSubcategoryFromDB = async (subCategory: string) => {
    const users = await User.find({
      my_service: { $in: [subCategory] }, 
      isDeleted: false,
    }).select("email first_name my_service extra_skills portfolio certificate");
  
    return users;
  };
  

  export const getCategorieFromDB = async (category: string) => {
    if (category === "all") {
      const categories = await Category.find().select("subCategories");
      const allSubCategories = categories.flatMap(cat => cat.subCategories);  
      return allSubCategories;
    }
  
    const selectedCategory = await Category.findOne({ category_name: category }).select("subCategories");
  
    return selectedCategory?.subCategories || [];
  };
  
