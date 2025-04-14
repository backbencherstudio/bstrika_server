/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { UserServices } from './user.service';
import config from '../../config';
import { AppError } from '../../errors/AppErrors';

declare module 'express-session' {
  interface SessionData {
    otpData?: {
      otp: string;
      createdAt : number;
      first_name : string;
      email : string;
      password : string;
      isDeleted : boolean;
      role : string
    };
  }
}

declare module 'express-session' {
  interface SessionData {
    resetOTP?: {
      otp: string;
      email : string;
      password : string;
    };
  }
}


const createUser = catchAsync(async (req, res) => {
    const result = await UserServices.createUserIntoDB(req.body);

  req.session.otpData = {
    otp: result.otp,
    first_name : result.first_name,
    email : result.email,
    password: result.password,
    isDeleted : result.isDeleted,
    role:result.role,
    createdAt: Date.now(),  
  };  

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent, please check your email.',
    data: result,  
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { otp } = req.body; 
  const sessionOtpData = req.session.otpData; 

  if (!sessionOtpData) {
    throw new AppError(400, 'OTP expired or not set.');
  }
  const currentTime = Date.now();
  const elapsedTime = (currentTime - sessionOtpData.createdAt) / 1000;

  if (elapsedTime > 120) { 
    req.session.destroy(() => {}); 
    throw new AppError(400, 'OTP has expired. Please request a new OTP.');
  }
  const result = await UserServices.verifyOTPintoDB(otp, sessionOtpData);
  req.session.destroy(() => {}); 
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
  const result = await UserServices.getSingleUserFromDB(req?.query?.email as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get single user',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await UserServices.resetPasswordIntoDB(req?.body); 
  req.session.resetOTP = {
    otp: result.otp,
    email : result.email,
    password: result.password ,
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP send Your Email, reset password withen 2 minuts',
    data: null,
  });
});

const verifyOtpForResetPassword = catchAsync(async (req, res)=>{
  const getOtpData = req.body;  
  const resetOtpData = req.session.resetOTP;
  if(!resetOtpData){
    throw new Error("OTP was expaired try again")
  }
  const result = await UserServices.updatePasswordWithOtpVerification(getOtpData, resetOtpData);
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
};
