import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './admin.service';

export const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

export const addSubCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.addSubCategory(req.params.categoryId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subcategory added successfully',
    data: result,
  });
});

export const removeSubCategory = catchAsync(async (req, res) => {  
  const result = await CategoryService.removeSubCategory(req.params.categoryId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subcategory removed successfully',
    data: result,
  });
});

export const getAllCategories = catchAsync(async (_req, res) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All categories fetched',
    data: result,
  });
});

