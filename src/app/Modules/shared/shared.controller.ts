/* eslint-disable no-undef */
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { findUsersBasedOnSubcategoryFromDB, getCategorieFromDB, SharedServices } from "./shared.service";

export const findUsersBasedOnSubcategory = catchAsync(async (req, res) => {    
    const result = await findUsersBasedOnSubcategoryFromDB(req?.query?.subCategory);
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

  const getReviewsByUser = catchAsync(async (req, res) => {
    const result = await SharedServices.getReviewsByUser(req.params.reciverId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review get successfully',
      data: result,
    });
  });


  const reviewLike = catchAsync(async (req, res) => {
    const result = await SharedServices.reviewLike(req.params.reviewId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'You Like This Review',
      data: result,
    });
  });

  const reviewDisLike = catchAsync(async (req, res) => {
    const result = await SharedServices.reviewDisLike(req.params.reviewId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'You Disike This Review',
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

  //====>>> get chat data, filtered by "true ... for chat" "false for pending accept"
  const getAllExchangeData = catchAsync(async (req, res) => {  
    
    const result = await SharedServices.getAllExchangeDataFromDB(req.query.userId as string, req.query.isAccepted as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Exchange data get successfully',
      data: result,
    });
  });

  const getAllExchangeDataFromDBForEachUser = catchAsync(async (req, res) => {  
    
    const result = await SharedServices.getAllExchangeDataFromDBForEachUser(req.params.userId as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Exchange data get successfully for dashboard',
      data: result,
    });
  });

  const chatexchangeRequestAcceptOrDeclineAPI = catchAsync(async (req, res) => {
    const result = await SharedServices.ChatExchangeRequestAcceptOrDeclineAPI(req.params.exchangeId, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'You accepted the request. Now you may begin communicating with each other.',
      data: result,
    });
  });

  const getIsAcceptNotificationUnReadDataForEachUser = catchAsync(async (req, res) => {
    const result = await SharedServices.ChatExchangeRequestAcceptOrDeclineAPI(req.params.exchangeId, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'You accepted the request. Now you may begin communicating with each other.',
      data: result,
    });
  });


  const getALlAcceptedDataForEachUser = catchAsync(async (req, res) => {
    const result = await SharedServices.getALlAcceptedDataForEachUser(req.params.userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'get all accepted data for each user',
      data: result,
    });
  });

  const getIsAcceptNotificationUnReadDataForEachUserIsAcceptTrue = catchAsync(async (req, res) => {
    const result = await SharedServices.getIsAcceptNotificationUnReadDataForEachUserIsAcceptTrue(req.params.senderUserId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'get Is Accept Notification **Read** Data for each user ',
      data: result,
    });
  });

  const getAcceptedDataForNav = catchAsync(async (req, res) => {
    const result = await SharedServices.getAcceptedDataForNav(req.params.senderUserId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'get all accepted data for each user ',
      data: result,
    });
  });

  const acceptExchangeController = catchAsync(async (req, res) => {
    const result = await SharedServices.acceptExchange(req.params.exchangeId, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'exchange accepted.',
      data: result,
    });
  });

  const reportPlacedToAdmin = catchAsync(async (req, res) => {

  const files = req.files as Express.Multer.File[];
   const document = files?.map((file) => `/uploads/${file.filename}`);

  const reportData = {
    ...req.body,
    document : document[0]
  };

    const result = await SharedServices.reportPlacedToAdmin(reportData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'report placed successfully , very sort time our team contact with you',
      data: result,
    });
  });
  

  const getALlReportsFromDBByAdmin = catchAsync(async (req, res) => {

    const result = await SharedServices.getALlReportsFromDBByAdmin();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'get all report successfully',
      data: result,
    });
  });

  const reportAcceptOrRejectByAdmin = catchAsync(async (req, res) => {

    const result = await SharedServices.reportAcceptOrRejectByAdmin(req.params.reportId, req.query.status);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'report status update successfully',
      data: result,
    });
  });

  
  const getSingleReportFromDB = catchAsync(async (req, res) => {
    const result = await SharedServices.getSingleReportFromDB(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'get single report successfully',
      data: result,
    });
  });
  
  const updateExchangeUpdateDateForSerial = catchAsync(async (req, res) => {
    const result = await SharedServices.updateExchangeUpdateDateForSerial(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'serial update',
      data: result,
    });
  });
  
  

export const SharedController = {
  createReview,
  sendAndStoreExchangeRequestController,
  getReviewsByUser,
  reviewLike,
  reviewDisLike,
  getAllExchangeData,
  chatexchangeRequestAcceptOrDeclineAPI,
  getAllExchangeDataFromDBForEachUser,
  getAcceptedDataForNav,
  acceptExchangeController,
  getIsAcceptNotificationUnReadDataForEachUser,
  getALlAcceptedDataForEachUser,
  getIsAcceptNotificationUnReadDataForEachUserIsAcceptTrue,
  reportPlacedToAdmin,
  getALlReportsFromDBByAdmin,
  getSingleReportFromDB,
  reportAcceptOrRejectByAdmin,
  updateExchangeUpdateDateForSerial
}


  