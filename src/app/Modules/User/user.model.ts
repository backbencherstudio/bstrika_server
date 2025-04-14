import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { TAddressInfo, TPersonalInfo, TUser } from "./user.interface";


const personalInfoSchema = new Schema<TPersonalInfo>(
  {
    first_name: { type: String },
    last_name: { type: String },
    display_name: { type: String },
    phone_number: { type: Number },
    gender: { type: String },
    dath_of_birth: { type: Date }, 
  },
  { _id: false }
);

const addressInfoSchema = new Schema<TAddressInfo>(
  {
    country: { type: String }, 
    streetAddress: { type: String },
    apt_suite: { type: String },
    city: { type: String },
    state_province_country_region: { type: String },
    zipCode: { type: Number },
  },
  { _id: false }
);


const userSchema = new Schema<TUser>(
  {
    userId: {
      type: String,
    },
    first_name: {
      type: String,
      required: [true, 'First name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    personalInfo: personalInfoSchema,
    addressInfo: addressInfoSchema,
    about_me : {
      type : String
    },
    my_service: {
      type: [String],
      default: [],
    },
    extra_skills: {
      type: [String],
      default: [],
    },
    portfolio: {
      type: String,
      default: '',
    },
    cartificate: {
      type: String,
      default: '',
    },
    reating: {
      type: Number,
    },

  },  
  {
    timestamps: true,
  }
);


userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

export const User = model<TUser>('User', userSchema);
