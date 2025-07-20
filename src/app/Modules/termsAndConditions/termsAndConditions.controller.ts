import { termsService } from './termsAndConditions.service';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';


const createTerms = catchAsync(async (req, res) => {
  const result = await termsService.createTerms(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'data set seccessfully',
    data: result,
  });
});




const getAllTerms = catchAsync(async (req, res) => {
    const result = await termsService.getAllTerms();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'data get seccessfully',
    data: result,
  });
});



const getTerms = catchAsync(async (req, res) => {
  const result = await termsService.getTermsById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single data get seccessfully',
    data: result,
  });
});




const updateTerms = catchAsync(async (req, res) => {
  const result = await termsService.updateTerms(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single data update seccessfully',
    data: result,
  });
});



const deleteTerms = catchAsync(async (req, res) => {
  const result = await termsService.deleteTerms(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'data delete seccessfully',
    data: result,
  });
});


export const termsController = {
  createTerms,
  getAllTerms,
  getTerms,
  updateTerms,
  deleteTerms
}