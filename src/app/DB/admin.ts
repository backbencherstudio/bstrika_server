
import bcrypt from "bcrypt";
import { User } from "../Modules/User/user.model";

const hashPassword = async (pass: number) => {
  return await bcrypt.hash(pass.toString(), 8); 
};

export const seedAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: "admin" , email : "admin@gmail.com" });

  if (!isSuperAdminExists) {
    const admin = {
      first_name: "need update",
      email: "admin@gmail.com",
      password: await hashPassword(12345678), 
      role: "admin",
      isDeleted: false,
    };

    await User.create(admin);
  }
};
