import { IPrivacyPolicy } from "./privacyPolicy.interface";
import { PrivacyPolicy } from "./privacyPolicy.module";

const createPrivacy = async (data: IPrivacyPolicy): Promise<IPrivacyPolicy> => {
  return await PrivacyPolicy.create(data);
};

const getAllPrivacy = async (): Promise<IPrivacyPolicy[]> => {
  return await PrivacyPolicy.find().sort({ createdAt: -1 });
};

const getPrivacyById = async (id: string): Promise<IPrivacyPolicy | null> => {
  return await PrivacyPolicy.findById(id);
};

const updatePrivacy = async (
  id: string,
  data: Partial<IPrivacyPolicy>
): Promise<IPrivacyPolicy | null> => {
  return await PrivacyPolicy.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deletePrivacy = async (id: string): Promise<IPrivacyPolicy | null> => {
  return await PrivacyPolicy.findByIdAndDelete(id);
};

export const privacyService = {
  createPrivacy,
  getAllPrivacy,
  getPrivacyById,
  updatePrivacy,
  deletePrivacy,
};
