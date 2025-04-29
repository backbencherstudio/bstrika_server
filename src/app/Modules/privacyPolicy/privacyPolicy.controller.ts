
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { privacyService } from './privacyPolicy.service';

const createPrivacy = catchAsync(async (req, res) => {
  const result = await privacyService.createPrivacy(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy created successfully',
    data: result,
  });
});

const getAllPrivacy = catchAsync(async (req, res) => {
  const result = await privacyService.getAllPrivacy();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policies retrieved successfully',
    data: result,
  });
});

const getPrivacy = catchAsync(async (req, res) => {
  const result = await privacyService.getPrivacyById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Privacy Policy retrieved successfully',
    data: result,
  });
});

const updatePrivacy = catchAsync(async (req, res) => {
  const result = await privacyService.updatePrivacy(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy updated successfully',
    data: result,
  });
});

const deletePrivacy = catchAsync(async (req, res) => {
  const result = await privacyService.deletePrivacy(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy deleted successfully',
    data: result,
  });
});

export const privacyController = {
  createPrivacy,
  getAllPrivacy,
  getPrivacy,
  updatePrivacy,
  deletePrivacy,
};
