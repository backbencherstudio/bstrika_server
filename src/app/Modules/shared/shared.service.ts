/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import { Category } from "../admin/admin.module";
import { User } from "../User/user.model";
import { TReviewReport, TReviews } from "./shared.interface";
import { Exchange, ExchangeAccepted, Report, Review } from "./shared.module";
import { AppError } from "../../errors/AppErrors";
import { NOT_ACCEPTABLE } from "http-status";
import { sendExchangeRequestEmail } from "../../utils/sendExchangeRequestEmail";

export const findUsersBasedOnSubcategoryFromDB = async (subCategory: any) => {
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
    { new: true, runValidators: true }
  );

  return result;
};





const getReviewsByUser = async (reciverId: string) => {
  return await Review.find({ reciverId }).populate('reviewerId');
};

const reviewLike = async (reviewId: string) => {
  return await Review.findByIdAndUpdate(
    { _id: reviewId },
    { $inc: { like: 1 } },
    { new: true }
  );
};

const reviewDisLike = async (reviewId: string) => {
  return await Review.findByIdAndUpdate(
    { _id: reviewId },
    { $inc: { disLike: 1 } },
    { new: true }
  );
};


const deleteReview = async (id: string) => {
  return await Review.findByIdAndDelete(id);
};

// ====================================== Review API,s End =============================


// ====================================== Exchange API,s Start =============================

const sendAndStoreExchangeRequest = async (payload: any) => {
  const emailArray = payload.map((item: { selectedEmail: any; }) => item.selectedEmail);
  await sendExchangeRequestEmail(emailArray)
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
  // console.log(query);


  const result = await Exchange.find(query).populate([
    // "senderUserId", "reciverUserId"
    {
      path: 'senderUserId'
    },
    {
      path: 'reciverUserId'
    }
  ]).sort("-updatedAt");

  return result;
};



const getAllExchangeDataFromDBForEachUser = async (id: string) => {

  const query = {
    $or: [
      { senderUserId: id },
      { reciverUserId: id }
    ]
  }

  const result = await Exchange.find(query).populate([
    {
      path: 'senderUserId'
    },
    {
      path: 'reciverUserId'
    }
  ]);

  return result;
};


const updateExchangeUpdateDateForSerial = async (payload: any) => {
  const { sender, recipient } = payload;
  await Exchange.updateOne(
    {
      $or: [
        { email: sender, selectedEmail: recipient },
        { email: recipient, selectedEmail: sender },
      ],
    },
    { $set: { updatedAt: new Date() } }
  );
}


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


const ChatExchangeRequestAcceptOrDeclineAPI = async (exchangeId: string, payload: any) => {

  if (payload?.isAccepted === "false") {
    const result = await Exchange.findByIdAndDelete({ _id: payload?.exchangeId }, { runValidators: true, new: true })
    return result
  }
  const result = await Exchange.findOneAndUpdate({ _id: exchangeId, reciverUserId: payload?.reciverUserId }, { isAccepted: payload?.isAccepted }, { new: true, runValidators: true })

  if (result) {
    const data = result.toObject();

    const {
      senderUserId,
      reciverUserId,
      email,
      selectedEmail,
      senderService,
      reciverService,
      isAccepted,
      reciverUserAccepted,
      senderUserAccepted,
      my_service,
    } = data;

    const acceptData = {
      senderUserId,
      reciverUserId,
      email,
      selectedEmail,
      senderService,
      reciverService,
      isAccepted,
      reciverUserAccepted,
      senderUserAccepted,
      my_service,
    };

    await ExchangeAccepted.create(acceptData);
  }


  return result

}





const getIsAcceptNotificationUnReadDataForEachUser = async (senderUserId: string) => {
  const result = await ExchangeAccepted.find({senderUserId, isAcceptNotificationRead : false})
  return result
}

const getIsAcceptNotificationUnReadDataForEachUserIsAcceptTrue = async (senderUserId: string) => {
  const result = await ExchangeAccepted.updateMany ({senderUserId}, {isAcceptNotificationRead : true}, {new : true, runValidators : true} )
  return result
}


//  const acceptExchange = async (exchangeId : string, payload : any) =>{

//   console.log(payload);
//   console.log(exchangeId);
//   const exchangeData = await Exchange.findById({ _id : exchangeId, $or : [{ sendderUserId : payload.userId }, {reciverUserId : payload.userId}]  })
//   console.log(exchangeData);




//   // const result = await Exchange.findByIdAndUpdate({_id : exchangeId}, {isExchange : true}, {new : true, runValidators : true})
//   // return result  

//  }



// const acceptExchange = async (exchangeId: string, payload: any) => {
//   const exchangeData = await Exchange.findOne({
//     _id: exchangeId,
//     $or: [
//       { senderUserId: payload.userId },
//       { reciverUserId: payload.userId }
//     ]
//   });

//   if (!exchangeData) {
//     return { success: false, message: "No exchange found for this user." };
//   }
//   if(exchangeData?.isAccepted !== "true"){
//     throw new AppError(NOT_ACCEPTABLE, "At First need to accept the request")
//   }

//   // Determine which field matched
//   const matchedField =
//     exchangeData.senderUserId.toString() === payload.userId
//     ? "senderUserAccepted"
//     : "reciverUserAccepted";      
//       const result = await Exchange.findByIdAndUpdate({_id : exchangeId}, {[matchedField] : true }, {new : true, runValidators : true});
//       return result  
// };


const acceptExchange = async (exchangeId: string, payload: any) => {
  // console.log(exchangeId, payload);

  const exchangeData = await Exchange.findOne({
    _id: exchangeId,
    $or: [
      { senderUserId: payload.userId },
      { reciverUserId: payload.userId }
    ]
  });

  if (!exchangeData) {
    return { success: false, message: "No exchange found for this user." };
  }

  if (exchangeData?.isAccepted !== "true") {
    throw new AppError(NOT_ACCEPTABLE, "At First need to accept the request");
  }

  const isSender = exchangeData.senderUserId.toString() === payload.userId;

  const updateData: any = {};

  if (isSender) {
    updateData.senderUserAccepted = true;
  } else {
    updateData.reciverUserAccepted = true;
    updateData.reciverService = payload.reciverService;
  }

  const result = await Exchange.findByIdAndUpdate(
    { _id: exchangeId },
    updateData,
    { new: true, runValidators: true }
  ).sort("-updateAt");

  console.log(result);

  return result;
};




// ====================================== Exchange API,s End =============================


// ======================== report API's Start ========================
const reportPlacedToAdmin = async (payload: TReviewReport) => {
  const result = await Report.create(payload)
  if (result) {
    await Review.findByIdAndUpdate({ _id: payload.reviewId }, { report: true }, { new: true, runValidators: true })
  }
  return result
}

const getSingleReportFromDB = async (reportId: string) => {
  const result = await Report.findById({ _id: reportId }).populate("reviewId")
  return result
}



const reportAcceptOrRejectByAdmin = async (reportId: string, status: any) => {
  const reportData = await Report.findById({ _id: reportId })

  if (status === "reject") {
    await Review.findByIdAndUpdate({ _id: reportData?.reviewId }, { report: false }, { runValidators: true, new: true })
    const result = await Report.findByIdAndUpdate({ _id: reportId }, { status }, { runValidators: true, new: true })
    return result
  }

  else {
    await Review.findByIdAndUpdate({ _id: reportData?.reviewId }, { report: true }, { runValidators: true, new: true })
    const result = await Report.findByIdAndUpdate({ _id: reportId }, { status }, { runValidators: true, new: true })
    return result
  }
}


const getALlReportsFromDBByAdmin = async () => {
  const result = await Report.find().populate({
    path: 'reviewId',
    populate: [
      {
        path: 'reciverId',
        select: 'first_name profileImage email personalInfo'
      },
      {
        path: 'reviewerId',
        select: 'first_name profileImage email personalInfo'
      }
    ]
  });
  return result
}




export const SharedServices = {
  createReviewIntoDB,
  getReviewsByUser,
  deleteReview,
  reviewLike,
  reviewDisLike,
  sendAndStoreExchangeRequest,
  getAllExchangeDataFromDB,
  getAllExchangeDataFromDBForEachUser,
  updateExchangeUpdateDateForSerial,
  ChatExchangeRequestAcceptOrDeclineAPI,
  getIsAcceptNotificationUnReadDataForEachUser,
  getIsAcceptNotificationUnReadDataForEachUserIsAcceptTrue,
  acceptExchange,
  reportPlacedToAdmin,
  getALlReportsFromDBByAdmin,
  reportAcceptOrRejectByAdmin,
  getSingleReportFromDB
}




























