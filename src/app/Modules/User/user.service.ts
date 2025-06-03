/* eslint-disable no-undef */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../errors/AppErrors";
import bcrypt from 'bcrypt';
import config from "../../config";
import { ReportProfile, TempUser, User } from "./user.model";
import { TLoginUser, TReportProfile, TUser } from "./user.interface";
import { createToken, verifyToken } from "./user.utils";
import { sendEmailToUser } from "../../utils/sendEmailToUser";
import { filteredObject } from "../../utils/updateDataUtils";
import QueryBuilder from "../../builder/QueryBuilder";
import path from "path";
import fs from "fs"
import { sendEmail } from "../../utils/sendEmail";
import { Exchange, Review } from "../shared/shared.module";
import { notificationMain } from "../../utils/notificationMain";
import mongoose from "mongoose";


const createUserIntoDB = async (payload: TUser) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const isUserExistsInUser = await User.findOne({ email: payload?.email });
  const isTempUserExistsInUser = await TempUser.findOne({ email: payload?.email });
  if (isUserExistsInUser) {
    throw new AppError(400, 'User already exists');
  }

  if (isTempUserExistsInUser) {
    const resetData = await TempUser.findOneAndUpdate({ email: payload.email }, { otp }, { runValidators: true, new: true })
    await sendEmail(payload?.email, otp);
    return resetData;
  }

  const tempUser = {
    otp,
    first_name: payload.first_name,
    email: payload.email,
    password: payload.password,
    isDeleted: false,
    role: payload.role
  }
  const setTempUser = await TempUser.create(tempUser)
  await sendEmail(payload?.email, otp);
  return setTempUser;
};

const verifyOTPintoDB = async (otp: string, email: string) => {
  const TempUserData = await TempUser.findOne({ email });
  if (!TempUserData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }
  const isMatchedOTP = Number(TempUserData.otp) !== Number(otp)
  if (isMatchedOTP) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "OTP not match")
  }




  const { first_name, isDeleted, role } = TempUserData;
  const hashedPassword = await bcrypt.hash(TempUserData?.password, 8);
  const updateData = {
    first_name, isDeleted, role, email,
    password: hashedPassword
  }

  const result = await User.create(updateData);
  if (result) {
    await TempUser.findOneAndDelete({ email })
  }
  return result
};

const loginUserIntoDB = async (paylod: TLoginUser) => {

  const userData = await User.findOne({ email: paylod.email });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  if (userData?.profileStatus === "suspend") {
    throw new AppError(httpStatus.NOT_FOUND, `Your account is currently suspended. You are unable to log in at this time. Access will be restored after the suspension period, typically within 7 to 10 days`);
  }
  if (userData?.profileStatus === "blocked") {
    throw new AppError(httpStatus.NOT_FOUND, `You have been permanently blocked by the admin. You will no longer be able to register or log in to this platform.`);
  }

  const res = await bcrypt.compare(paylod.password, userData.password)
  if (!res) {
    throw new AppError(httpStatus.FORBIDDEN, 'password is not matched');
  }

  const jwtPayload = {
    email: userData.email,
    role: userData.role,
    userId: userData._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

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

const updateUserDataIntoDB = async (payload: Partial<TUser>) => {
  try {
    const userData = await User.findById(payload.userId).select("profileImage");
    
    if (userData?.profileImage) {
      const absoluteFilePath = getAbsoluteFilePath(userData.profileImage);
      if (absoluteFilePath) {
        deleteFile(absoluteFilePath);
      }
    }
    const updatedPayload = filteredObject(payload);

    const result = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updatedPayload },
      { new: true, runValidators: true }
    );

    return result;
  } catch (error) {
    console.error(`Error updating user data:`, error);
    throw new Error('Failed to update user data');
  }
};

// =====================================================================  portfolio API Start ===============================
const setPortfolioImageIntoDB = async (id: string, payload: any) => {
  const userData = await User.findById({ _id: id }).select("portfolio");
  if (userData?.portfolio) {
    const absoluteFilePath = getAbsoluteFilePath(userData.portfolio);
    if (absoluteFilePath) {
      deleteFile(absoluteFilePath);
    }
  }

  const result = await User.findByIdAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true }
  );

  return result;
};

const deletePortfolioImageFromDB = async (id: string) => {
  const userData = await User.findById({ _id: id }).select("portfolio");
  if (userData?.portfolio) {
    const absoluteFilePath = getAbsoluteFilePath(userData?.portfolio);
    if (absoluteFilePath) {
      deleteFile(absoluteFilePath);
    }
  }

  const result = await User.findByIdAndUpdate(
    { _id: id },
    { $set: { portfolio: "" } },
    { new: true, runValidators: true }
  );

  return result;
};
// =====================================================================  portfolio API End ======================================


// =====================================================================  cartificate API start  =======================================
const setCartificateIntoDB = async (id: string, payload: any) => {
  const userData = await User.findById({ _id: id }).select("cartificate");
  if (userData?.cartificate) {
    const absoluteFilePath = getAbsoluteFilePath(userData.cartificate);
    if (absoluteFilePath) {
      deleteFile(absoluteFilePath);
    }
  }
  const result = await User.findByIdAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true }
  );

  return result;
};


const deleteCartificateFromDB = async (id: string) => {
  const userData = await User.findById({ _id: id }).select("cartificate");
  if (userData?.cartificate) {
    const absoluteFilePath = getAbsoluteFilePath(userData.cartificate);
    if (absoluteFilePath) {
      deleteFile(absoluteFilePath);
    }
  }
  const result = await User.findByIdAndUpdate(
    { _id: id },
    { $set: { cartificate: "" } },
    { new: true, runValidators: true }
  );

  return result;
};
// ====================================================================  cartificate API END  =======================================


// ======================================================================  Service API Start =========================
const addServicesIntoDB = async (id: string, payload: { my_service: string[] }) => {
  const result = await User.findByIdAndUpdate({ _id: id }, { $set: payload }, { new: true, runValidators: true })
  return result
}

const deleteServicesFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate({ _id: id }, { $set: { my_service: [] } }, { new: true, runValidators: true })
  return result
}
// =======================================================================  Service API end  =======================


// =======================================================================  extra_skills API Start =========================
const addExtraSkillsIntoDB = async (id: string, payload: { extra_skills: string[] }) => {
  const result = await User.findByIdAndUpdate({ _id: id }, { $set: payload }, { new: true, runValidators: true })
  return result
}

const deleteExtraSkillsFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate({ _id: id }, { $set: { extra_skills: [] } }, { new: true, runValidators: true })
  return result
}
// ========================================================================  extra_skills API end  =======================




const getAllUserFromDB = async (query: Record<string, unknown>) => {  
  const userQuery = new QueryBuilder(User.find({ profileStatus: "safe" }), query)
    .search([
      "my_service",
      "addressInfo.zipCode",
      "addressInfo.city",
      "addressInfo.country"
    ])
    .filter();
  const result = await userQuery.modelQuery.select(
    'first_name email profileImage rating my_service portfolio review addressInfo'
  );  
  return result;
};


const getSingleUserFromDB = async (userId: string) => {
  const result = await User.findById({ _id: userId });
  const allReview = await Review.find({ reviewerId: userId }).sort({ createdAt: -1 }).populate([
    {
      path: 'reviewerId',
      select: 'first_name image email personalInfo'
    },
  ]);
  return {
    user: result,
    reviews: allReview
  };
};


// const resetPasswordIntoDB = async (payload: any) => {
//   const isUserExistsInUser = await User.findOne({ email: payload?.email });
//   if (!isUserExistsInUser) {
//     throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
//   }
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   // await sendEmail(payload?.email, otp);

//   console.log(otp);

//   const result = {
//     first_name:"dummyname",
//     otp,
//     email: payload.email,
//     password: payload.password
//   }

//   console.log(331, result);

//   const createOtp = await TempUser.create(result);
  
//   console.log(createOtp);
  
  
//   return result
// }



const resetPasswordIntoDB = async (payload: any) => {
  const isUserExistsInUser = await User.findOne({ email: payload?.email });
  if (!isUserExistsInUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const result = {
    first_name: "dummyname",
    otp,
    email: payload.email,
    password: payload.password
  };


  const createOrUpdateOtp = await TempUser.findOneAndUpdate(
    { email: payload.email }, 
    result,                   
    { upsert: true, new: true } 
  );

  await sendEmail(payload?.email, otp);

  return createOrUpdateOtp;
};


const updatePasswordWithOtpVerification = async (getOtpData: any) => {
  
  const existsData = await TempUser.findOne({email : getOtpData?.email});
  if (!existsData) {
    return new AppError(httpStatus.NOT_FOUND,"Data not found")    
  }
  if (parseInt(getOtpData?.otp) !== parseInt(existsData.otp)) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "OTP not match")
  } 

  const hashedPassword = await bcrypt.hash(existsData?.password, 8);
  const result = await User.findOneAndUpdate({ email: getOtpData.email }, { password: hashedPassword }, { new: true, runValidators: true })

  if(result){
    await TempUser.findOneAndDelete({email  : existsData?.email})
  }

  return result
}



const userDeleteIntoDB = async (payload: any) => {
  const isUserExists = await User.findOne({ email: payload });
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found")
  }
  const result = await User.findOneAndUpdate({ email: payload }, { isDeleted: true }, { new: true, runValidators: true })
  return result
}

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize!');
  }
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  const userData = await User.findOne({ email });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  const jwtPayload = {
    email: userData.email,
    role: userData.role,
    userId: userData._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};


const sendEmailToAllUser = async (payload: any) => {
  const { email, subject, value, filePath } = payload;
  const result = await sendEmailToUser(email, subject, value, filePath)
  return result;
}

const sendProfileReportToTheAdmin = async (payload: TReportProfile) => {
  const result = await ReportProfile.create(payload);
  return result
}

// const actionProfileReportService = async (id : string, {action} : {action : string} )=>{

//   if(action === "suspend"){    
//     const existsData = await ReportProfile.findById({_id : id});
//     const result = await ReportProfile.findByIdAndUpdate({_id : id}, {action}, {runValidators : true, new : true});
//     await User.findByIdAndUpdate({_id : existsData?.reportedId}, {profileStatus : action }, {runValidators : true, new : true}); 

//     await notificationMain(existsData?.email, "Suspended notification" , "Your account is currently suspended. You are unable to log in at this time. Access will be restored after the suspension period, typically within 7 to 10 days") 

//     return {
//       message : "profile suspended successfully",
//       result : result
//     }
//   }
//   else{
//     const existsData = await ReportProfile.findById({_id : id});
//     await ReportProfile.findByIdAndUpdate({_id : id}, {action}, {runValidators : true, new : true});
//     const userData = await User.findByIdAndUpdate({_id : existsData?.reportedId}, {profileStatus : action }, {runValidators : true, new : true});

//     await notificationMain(existsData?.email, "Suspended notification" , "You have been permanently blocked by the admin. You will no longer be able to register or log in to this platform") 

//     return {
//       message : "profile blocked permanently",
//       result : userData
//     }
//   }



// }


// const actionProfileReportService = async (id: string, { action }: { action: string }) => {
//   const existsData = await ReportProfile.findById({ _id: id });

//   if (!existsData) {
//     throw new Error("Report not found");
//   }

//   const reportedUser = await User.findById(existsData?.reportedId);

//   if (!reportedUser) {
//     throw new Error("Reported user not found");
//   }

//   if (action === "suspend") {
//     const result = await ReportProfile.findByIdAndUpdate(
//       { _id: id },
//       { action },
//       { runValidators: true, new: true }
//     );
//     await User.findByIdAndUpdate(
//       { _id: existsData?.reportedId },
//       { profileStatus: action },
//       { runValidators: true, new: true }
//     );

//     await notificationMain(
//       reportedUser.email,
//       "Suspended Notification",
//       "Your account is currently suspended. You are unable to log in at this time. Access will be restored after the suspension period, typically within 7 to 10 days."
//     );

//     return {
//       message: "Profile suspended successfully",
//       result: result,
//     };
//   }
//   else if(
//     action === "safe"
//   ){
//     const result = await ReportProfile.findByIdAndUpdate(
//       { _id: id },
//       { action },
//       { runValidators: true, new: true }
//     );
//     await User.findByIdAndUpdate(
//       { _id: existsData?.reportedId },
//       { profileStatus: action },
//       { runValidators: true, new: true }
//     );

//     await notificationMain(
//       reportedUser.email,
//       "safe Notification",
//       "Your account is currently safe. You are unable to log in at this time. Access will be restored after the suspension period, typically within 7 to 10 days."
//     );

//     return {
//       message: "Profile safe successfully",
//       result: result,
//     };
//   }
//    else {
//     await ReportProfile.findByIdAndUpdate(
//       { _id: id },
//       { action },
//       { runValidators: true, new: true }
//     );
//     const userData = await User.findByIdAndUpdate(
//       { _id: existsData?.reportedId },
//       { profileStatus: action },
//       { runValidators: true, new: true }
//     );

//     await notificationMain(
//       reportedUser.email,
//       "Blocked Notification",
//       "You have been permanently blocked by the admin. You will no longer be able to register or log in to this platform."
//     );

//     return {
//       message: "Profile blocked permanently",
//       result: userData,
//     };
//   }
// };

const actionProfileReportService = async (
  id: string,
  { action }: { action: string }
) => {
  const report = await ReportProfile.findById(id);
  if (!report) throw new Error("Report not found");
  const user = await User.findById(report.reportedId);
  if (!user) throw new Error("Reported user not found");

  const statusMessages: Record<string, { subject: string; message: string }> = {
    suspend: {
      subject: "Account Suspended",
      message:
        "Your account has been suspended. You are currently unable to log in. Access will typically be restored within 7 to 10 days.",
    },
    safe: {
      subject: "Account Status: Safe",
      message:
        "Your account has been marked safe. You are currently able to log in.",
    },
    blocked: {
      subject: "Account Permanently Blocked",
      message:
        "You have been permanently blocked by the admin. You will no longer be able to register or access this platform.",
    },
  };

  const status = statusMessages[action] ? action : "blocked";

  const updatedReport = await ReportProfile.findByIdAndUpdate(
    id,
    { action: status },
    { new: true, runValidators: true }
  );

  const updatedUser = await User.findByIdAndUpdate(
    report.reportedId,
    { profileStatus: status },
    { new: true, runValidators: true }
  );

  const { subject, message } = statusMessages[status];
  await notificationMain(user.email, subject, message);

  return {
    message: `Profile ${status} successfully`,
    result: status === "blocked" ? updatedUser : updatedReport,
  };
};


const getAllReportByAdminFromDB = async () => {
  const result = await ReportProfile.find({action: { $in: ["pending", "blocked"] }}).populate([
    {
      path: 'reporterId',
      select: 'first_name profileImage email personalInfo'
    },
    {
      path: 'reportedId',
      select: 'first_name profileImage email personalInfo'
    }
  ]);
  return result
}

const getAllSuspendedDataFromBD = async () =>{  

  const result = await ReportProfile.find( {action : "suspend"} ).populate([
    {
      path: 'reporterId',
      select: 'first_name profileImage email personalInfo'
    },
    {
      path: 'reportedId',
      select: 'first_name profileImage email personalInfo'
    }
  ])
  
  return result
}


const getAllDataOverviewByUser = async(id : string ) =>{
  
  const exchangeRequest = await Exchange.find({reciverUserId : id, isAccepted : "false"}).countDocuments()
  const confirmExchange = await Exchange.find({
    $or: [
      { reciverUserId: id },
      { senderUserId: id }
    ],
    reciverUserAccepted: true,
    senderUserAccepted: true
  }).countDocuments();
  const totalReview = await Review.find({reciverId : id}).countDocuments();

  return{
    exchangeRequest,
    confirmExchange,
    totalReview 
  }
}

// const exchangeHistorybyUser = async(id : string, date : any) =>{
//   console.log(date);
//   const exchangeHistory = await Exchange.find({
//     $or: [
//       { reciverUserId: id },
//       { senderUserId: id }
//     ],
//     reciverUserAccepted: true,
//     senderUserAccepted: true
//   })
//   console.log(exchangeHistory);
// }


const exchangeHistorybyUser = async (id: string, inputYear?: string | number) => {
  let targetYear: number;
  
  if (inputYear) {
    const yearNum = typeof inputYear === 'string' ? parseInt(inputYear) : inputYear;
    if (!isNaN(yearNum) && yearNum.toString().length === 4) {
      targetYear = yearNum;
    } else {
      throw new Error("Invalid year format. Please provide a 4-digit year.");
    }
  } else {
    targetYear = new Date().getFullYear();
  }

  const startDate = new Date(Date.UTC(targetYear, 0, 1)); 
  const endDate = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59, 999));

  try {
    const exchanges = await Exchange.find({
      $or: [
        { reciverUserId: id },
        { senderUserId: id }
      ],
      reciverUserAccepted: true,
      senderUserAccepted: true,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).lean();

    const monthlyCounts = Array(12).fill(0);    
    exchanges.forEach(exchange => {
      const date = new Date(exchange.createdAt );
      if (date.getUTCFullYear() === targetYear) {
        monthlyCounts[date.getUTCMonth()]++;
      } else {
        console.warn(`WARNING: Found date outside filter range: ${date.toISOString()}`);
      }
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    
    return monthlyCounts.map((count, index) => ({
      month: monthNames[index],
      year: targetYear,
      count
    }));

  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch exchange history");
  }
};












export const UserServices = {
  getAllUserFromDB,
  setPortfolioImageIntoDB,
  deletePortfolioImageFromDB,
  setCartificateIntoDB,
  deleteCartificateFromDB,
  addServicesIntoDB,
  deleteServicesFromDB,
  addExtraSkillsIntoDB,
  deleteExtraSkillsFromDB,
  getSingleUserFromDB,
  updateUserDataIntoDB,
  createUserIntoDB,
  userDeleteIntoDB,
  verifyOTPintoDB,
  updatePasswordWithOtpVerification,
  loginUserIntoDB,
  resetPasswordIntoDB,
  refreshToken,
  sendEmailToAllUser,
  sendProfileReportToTheAdmin,
  getAllReportByAdminFromDB,
  actionProfileReportService,
  getAllSuspendedDataFromBD,
  getAllDataOverviewByUser,
  exchangeHistorybyUser
};