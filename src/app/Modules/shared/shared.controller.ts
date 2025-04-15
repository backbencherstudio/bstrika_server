import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { findUsersBasedOnSubcategoryFromDB, getCategorieFromDB, SharedServices } from "./shared.service";

export const findUsersBasedOnSubcategory = catchAsync(async (req, res) => {    
    const result = await findUsersBasedOnSubcategoryFromDB(req?.body?.subCategory);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'get all users base on subcategory',
      data: result,
    });
  });

  export const getCategory = catchAsync(async (req, res) => {
    const result = await getCategorieFromDB(req.query.category as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'categories fetched',
      data: result,
    });
  });
  

  // ============================================================== Reviews controllers Start =================================
  const createReview = catchAsync(async (req, res) => {
    const result = await SharedServices.createReviewIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Your review placed successfully',
      data: result,
    });
  });
  
  

export const ReviewController = {
  createReview
}


  