/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { UserServices } from './user.service';
import config from '../../config';


const createUser = catchAsync(async (req, res) => {
    const result = await UserServices.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent, please check your email.',
    data: result,  
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { otp, email } = req.body;
  const result = await UserServices.verifyOTPintoDB(otp, email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
}); 

const loginUser = catchAsync(async (req, res) => {  
  const result = await UserServices.loginUserIntoDB(req.body);

  const { refreshToken, accessToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'development',
    httpOnly: true,
    sameSite : 'none',    
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is loged in successfully',
    data: {
      accessToken,
    },
  });
});

const updateUserData = catchAsync(async (req, res) => {
  
  const files = req.files as Express.Multer.File[];
  const profileImage = files?.map((file) => `/uploads/${file.filename}`);

  const profileData = {
    ...req.body,
    profileImage : profileImage[0]
  };
    
  const result = await UserServices.updateUserDataIntoDB(profileData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Data update successfully',
    data: result,
  });
});


const setPortfolioImage = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const portfolioImage = files?.map((file) => `/uploads/${file.filename}`);

  const profileData = {
    portfolio : portfolioImage[0]
  };  
  const result = await UserServices.setPortfolioImageIntoDB(req?.params.id,  profileData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio added successfully',
    data: result,
  });
});

const deletePortfolioImage = catchAsync(async (req, res) => {  
  const result = await UserServices.deletePortfolioImageFromDB(req?.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio delete successfully',
    data: result,
  });
});

const setCartificate = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const cartificateImage = files?.map((file) => `/uploads/${file.filename}`);

  const cartificateData = {
    cartificate : cartificateImage[0]
  };  
  const result = await UserServices.setCartificateIntoDB(req?.params.id,  cartificateData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'certificate added successfully',
    data: result,
  });
});


const deleteCertificate = catchAsync(async (req, res) => {  
  const result = await UserServices.deleteCartificateFromDB(req?.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'certificate delete successfully',
    data: result,
  });
});

const addServices = catchAsync(async (req, res) => {  
  const result = await UserServices.addServicesIntoDB(req?.params.id, req?.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services added successfully',
    data: result,
  });
});

const deleteServices = catchAsync(async (req, res) => {  
  const result = await UserServices.deleteServicesFromDB(req?.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services Remove successfully',
    data: result,
  });
});


const addExtraSkills = catchAsync(async (req, res) => {  
  const result = await UserServices.addExtraSkillsIntoDB(req?.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Extra Skills Added successfully',
    data: result,
  });
});

const deleteExtraSkills = catchAsync(async (req, res) => {  
  const result = await UserServices.deleteExtraSkillsFromDB(req?.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Extra Skills Remove successfully',
    data: result,
  });
});


const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB(req?.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all users',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await UserServices.getSingleUserFromDB(req?.params.userId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get single user',
    data: result.user,
    reviews : result.reviews
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await UserServices.resetPasswordIntoDB(req?.body); 
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP send Your Email, reset password withen 2 minuts',
    data: result,
  });
});

const verifyOtpForResetPassword = catchAsync(async (req, res)=>{
  const getOtpData = req.body;  
  
  const result = await UserServices.updatePasswordWithOtpVerification(getOtpData);
  req.session.destroy(() => {}); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'reset password successfully!',
    data: result,
  });

} )

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access is token retrived successfully',
    data: result,
  });
});


const userDelete = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await UserServices.userDeleteIntoDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Delete successFully',
    data: result,
  });
});


const sendEmailToUser = catchAsync(async (req, res) => {
  const result = await UserServices.sendEmailToAllUser(req.body); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Email send  successfully',
    data: result,
  });
});

const sendProfileReportToTheAdmin = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const supportingFile = files?.map((file) => `/uploads/${file.filename}`);

  const reportedData = {
    ...req.body,
    supportingFile : supportingFile[0]
  };

  const result = await UserServices.sendProfileReportToTheAdmin(reportedData); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile report placed successfully',
    data: result,
  });
});

const getAllReportByAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.getAllReportByAdminFromDB(); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all Profile report successfully',
    data: result,
  });
});

const actionProfileReportService = catchAsync(async (req, res) => {
  const result = await UserServices.actionProfileReportService(req.params.reportId, req.body); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result?.message,
    data: result.result,
  });
});

const getAllSuspendedDataFromBD = catchAsync(async (req, res) => {
  const result = await UserServices.getAllSuspendedDataFromBD(); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get all suspend data successfully",
    data: result,
  });
});

const getAllDataOverviewByUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllDataOverviewByUser(req.params.userId); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get overview data successfully",
    data: result,
  });
});

const exchangeHistorybyUser = catchAsync(async (req, res) => {
  const result = await UserServices.exchangeHistorybyUser(req.params.userId, req.query.date as number | string ); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get all Confirmed Exchange History data successfully",
    data: result,
  });
});



export const userController = {
  getAllUser,
  setPortfolioImage,
  deletePortfolioImage,
  setCartificate,
  deleteCertificate,
  addServices,
  deleteServices,
  addExtraSkills,
  deleteExtraSkills,
  getSingleUser,
  createUser,
  loginUser,
  updateUserData,
  userDelete,
  verifyOTP,
  refreshToken,
  resetPassword,
  verifyOtpForResetPassword,
  sendEmailToUser,
  sendProfileReportToTheAdmin,
  getAllReportByAdmin,
  actionProfileReportService,
  getAllSuspendedDataFromBD,
  getAllDataOverviewByUser,
  exchangeHistorybyUser
};
 