import { User_Role } from "../Modules/User/user.constent";
import { User } from "../Modules/User/user.model";
import bcrypt from "bcrypt";

const hashPassword = async (pass: number) => {
  return await bcrypt.hash(pass.toString(), 8); 
};

export const seedAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: User_Role.admin , email : "austinknapp88@yahoo.com" });

  if (!isSuperAdminExists) {
    const admin = {
      name: "need update",
      email: "austinknapp88@yahoo.com",
      password: await hashPassword(123456), 
      role: User_Role.admin,
      isDeleted: false,
    };

    await User.create(admin);
  }
};
