/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { User_Role } from './user.constent';

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
  zipCode ?: number;
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
  reating ?: number
}

// ======================================>>>>>>>> Login Interface
export type TLoginUser = {
  email: string;
  password: string;
};

 
export interface UserModel extends Model<TUser> {
  isUserExistsByCustomeId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof User_Role;
