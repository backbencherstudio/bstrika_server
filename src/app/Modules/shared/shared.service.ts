
import mongoose from "mongoose";
import { Category } from "../admin/admin.module";
import { User } from "../User/user.model";
import { TReviews } from "./shared.interface";
import { Review } from "./shared.module";

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
  



// ====================================== Review API,s Start =============================

//  const createReviewIntoDB = async (data: TReviews) => {
//   console.log(data);
//   const userData = await User.findById({_id : data?.reciverId}).select('review')
//   console.log(userData);

//   const result = await Review.create(data)

  
//   await User.findByIdAndUpdate({_id : data.reciverId}, {review : userData?.review + 1 });  
//   const allRatingAvarageValue = await Review.find({reciverId : data.reciverId})


//   return result
  

// };


const createReviewIntoDB = async (data: TReviews) => {

  const result = await Review.create(data);

  const aggregationResult = await Review.aggregate([
    {
      $match: { reciverId: new mongoose.Types.ObjectId(String(data?.reciverId)) }
    },
    {
      $group: {
        _id: '$reciverId',
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  const avgRating = aggregationResult[0]?.avgRating || 0;

  await User.findByIdAndUpdate(
    data.reciverId,
    {
      $set: { rating: avgRating.toFixed(1) },
      $inc: { review: 1 }
    },
    { new: true }
  );

  return result;
};



const getReviewsByUser = async (reciverId: string) => {
  return await Review.find({ reciverId }).populate('reviewerId');
};

 const deleteReview = async (id: string) => {
  return await Review.findByIdAndDelete(id);
};

// ====================================== Review API,s End =============================


export const SharedServices = {
  createReviewIntoDB,
  getReviewsByUser,
  deleteReview
}






























