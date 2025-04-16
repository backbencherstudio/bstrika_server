/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import { Category } from "../admin/admin.module";
import { User } from "../User/user.model";
import { TReviewReport, TReviews } from "./shared.interface";
import { Exchange, Report, Review } from "./shared.module";

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
    { new: true, runValidators : true }
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


// ====================================== Exchange API,s Start =============================

const sendAndStoreExchangeRequest = async (payload : any)=>{

  const emailArray = payload.map((item: { email: any; }) => item.email);
  // await sendExchangeRequestEmail(emailArray)

  const result = await Exchange.create(payload)
  return result  
}

//====>>> get chat data, filtered by "true ... for chat" "false for pending accept"
//=====>>> jokhon All connections a click korbe tokhon true send korbe,,, 
//=====>>> jokhon Request a click korbe tokhon false send korbe,,, 
//=====>>> isAccepted "false" hole , jara jara take request pathiyeche tader data show korbe, se caile request accept korbe , na caile decline korbe,,, ar
//  true hole se jader request accept korse a jara tar request accept korse sobar data dekhabe ,,,, 
const getAllExchangeDataFromDB = async (id: string, isAccepted: string) => {
  const isAcceptedBool = isAccepted === "true";
  
  const query = isAcceptedBool
    ? {
        isAccepted: true,
        $or: [
          { senderUserId: id },
          { reciverUserId: id }
        ]
      }
    : {
        isAccepted: false,
        reciverUserId: id
      };

  const result = await Exchange.find(query).populate("reciverUserId");

  return result;
};
// ===================== not remove this function now
// const getAllExchangeDataFromDB = async (id: string, isAccepted: boolean) => {
//   const result = await Exchange.find({
//     isAccepted,
//     $or: [
//       { senderUserId: id }, 
//       { reciverUserId: id }
//     ]
//   }).populate("reciverUserId");

//   return result;
// };


 const ChatExchangeRequestAcceptOrDeclineAPI = async (exchangeId : string, isAcceptedStatus : string  ) =>{
  const result = await Exchange.findByIdAndUpdate({_id : exchangeId}, {isAccepted : isAcceptedStatus}, {new : true, runValidators : true})
  return result  
 }

 const acceptExchange = async (exchangeId : string) =>{
  const result = await Exchange.findByIdAndUpdate({_id : exchangeId}, {isExchange : true}, {new : true, runValidators : true})
  return result  
 }


// ====================================== Exchange API,s End =============================


// ======================== report API's Start ========================
const reportPlacedToAdmin = async (payload : TReviewReport)=>{ 
  const result = await Report.create(payload)
  if(result){
    await Review.findByIdAndUpdate({_id : payload.reportId}, {report : true}, {new : true, runValidators : true})
  }
  return result   
}

const getALlReportsFromDBByAdmin = async () =>{
  const result = await Report.find();
  return result
}




export const SharedServices = {
  createReviewIntoDB,
  getReviewsByUser,
  deleteReview,
  sendAndStoreExchangeRequest,
  getAllExchangeDataFromDB,
  ChatExchangeRequestAcceptOrDeclineAPI,
  acceptExchange,
  reportPlacedToAdmin,
  getALlReportsFromDBByAdmin
}






























