import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { ITempUser, TAddressInfo, TPersonalInfo, TReportProfile, TUser } from "./user.interface";

const tempUserSchema = new Schema<ITempUser>(
  {
    otp: { type: String, required: true },
    first_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
)


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
    zipCode: { type: String },
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
    profileStatus: {
      type: String,
      enum: ['safe', 'suspend', 'block'],
      default: 'safe',
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
    rating: {
      type: Number,
      default : 0
    },
    review: {
      type: Number,
      default : 0
    },

  },  
  {
    timestamps: true,
  }
);

const reportProfileSchema = new Schema<TReportProfile>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    reportedId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    reportType: {
      type: String,
      required: true,
    },
    supportingFile: {
      type: String,
      required: false,
    },
    action: {
        type: String,
        enum: ['pending', 'suspend', 'block'],
        default: 'pending',
      },
  },
  {
    timestamps: true, 
  }
);

export const ReportProfile = model<TReportProfile>("ReportProfile", reportProfileSchema);


userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

export const User = model<TUser>('User', userSchema);

export const TempUser = model<ITempUser>('TempUser', tempUserSchema);
