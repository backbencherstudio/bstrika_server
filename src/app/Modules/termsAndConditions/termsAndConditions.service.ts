import { ITermsAndConditions } from "./termsAndConditions.interface";
import { TermsAndConditions } from "./termsAndConditions.module";


const createTerms = async (data: ITermsAndConditions): Promise<ITermsAndConditions> => {
  return await TermsAndConditions.create(data);
};

const getAllTerms = async (): Promise<ITermsAndConditions[]> => {
  return await TermsAndConditions.find().sort({ createdAt: -1 });
};

const getTermsById = async (id: string): Promise<ITermsAndConditions | null> => {
  return await TermsAndConditions.findById(id);
};

const updateTerms = async (
  id: string,
  data: Partial<ITermsAndConditions>
): Promise<ITermsAndConditions | null> => {
  return await TermsAndConditions.findByIdAndUpdate(id, data, { new: true, runValidators : true });
};

const deleteTerms = async (id: string): Promise<ITermsAndConditions | null> => {
  return await TermsAndConditions.findByIdAndDelete(id);
};


export const termsService = {
    createTerms,
    getAllTerms,
    getTermsById,
    updateTerms,
    deleteTerms
}

 
