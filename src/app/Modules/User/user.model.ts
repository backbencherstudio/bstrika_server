import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { TUser } from "./user.interface";


const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },    
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profileImage: {
      type: String,
    },
    role : {
      type : String,
      default : "user"
    },
    isDeleted : {
      type : Boolean,
      default : false
    }
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
