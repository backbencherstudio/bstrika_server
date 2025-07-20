/* eslint-disable no-unused-vars */
import { Model, Schema } from 'mongoose';
import { User_Role } from './user.constent';

// ======================================>>>>>>>> Temp User Interface

export interface ITempUser {
  otp: string;
  first_name: string;
  email: string;
  password: string;
  isDeleted: boolean;
  role?: string;
}



// ======================================>>>>>>>> Register Interface

export type TPersonalInfo = {
  first_name  : string;
  last_name  : string;
  display_name  : string;
  phone_number : number;
  gender : string;
  dath_of_birth : Date
}

export type TAddressInfo = {
  country ?: string;
  streetAddress ?: string;
  apt_suite ?: string;
  city ?: string
  state_province_country_region ?: string
  zipCode ?: string;
}


export interface TUser {
  userId : string;
  first_name: string;
  email: string;
  role : "admin" | "user";
  password: string;
  isDeleted: boolean;
  profileImage?:string;
  personalInfo?:TPersonalInfo;
  addressInfo?:TAddressInfo;
  about_me? : string ;
  my_service? : string[];
  extra_skills? : string[];
  portfolio : string;
  cartificate : string;
  rating ?: number;
  review ?: number;
  profileStatus : "safe" | "suspend" | "blocked";
}

// ======================================>>>>>>>> Login Interface
export type TLoginUser = {
  email: string;
  password: string;
};


export type TReportProfile = {
  reporterId : Schema.Types.ObjectId,
  reportedId : Schema.Types.ObjectId,
  reportType : string,
  supportingFile : string,
  action : "pending" | "suspend" | "blocked" | 'safe';
}

 
export interface UserModel extends Model<TUser> {
  isUserExistsByCustomeId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof User_Role;
