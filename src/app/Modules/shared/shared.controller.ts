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


  // ============================================================== Exchange controllers Start =================================
  const sendAndStoreExchangeRequestController = catchAsync(async (req, res) => {
    const result = await SharedServices.sendAndStoreExchangeRequest(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Exchange request send successfully',
      data: result,
    });
  });

  const getAllExchangeData = catchAsync(async (req, res) => {
    const result = await SharedServices.getAllExchangeDataFromDB(req.body.userId, req.body.isAccepted);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Exchange data get successfully',
      data: result,
    });
  });

  const chatexchangeRequestAcceptOrDeclineAPI = catchAsync(async (req, res) => {
    const result = await SharedServices.ChatExchangeRequestAcceptOrDeclineAPI(req.params.exchangeId, req.body.isAcceptedStatus);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'You accepted the request. Now you may begin communicating with each other.',
      data: result,
    });
  });


  const acceptExchangeController = catchAsync(async (req, res) => {
    const result = await SharedServices.acceptExchange(req.params.exchangeId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'exchange accepted.',
      data: result,
    });
  });
  
  

export const SharedController = {
  createReview,
  sendAndStoreExchangeRequestController,
  getAllExchangeData,
  chatexchangeRequestAcceptOrDeclineAPI,
  acceptExchangeController
}


  