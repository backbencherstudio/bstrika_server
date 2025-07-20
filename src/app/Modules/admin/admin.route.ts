import express from 'express';
import { addSubCategory, createCategory, deleteCategoryByAdmin, getAllCategories, getAllExchangeDatabyAdmin, removeSubCategory, showALlExchangeServiceUserMessageDataFromDBByAdmin, showALlReportMessageDataFromDBByAdmin, updateCategory } from './admin.controller';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../User/user.constent';
import { upload } from '../../middleware/upload';

const router = express.Router();

router.post('/', Auth(User_Role.admin), createCategory);

router.patch(
    '/:categoryId',
    // Auth(User_Role.admin),
    upload.array('categoryImage', 1),
    addSubCategory
);

router.patch('/updateCategory/:categoryId',
    // Auth(User_Role.admin),
    updateCategory);

router.delete(
    '/:categoryId',
    Auth(User_Role.admin),
    deleteCategoryByAdmin
);

router.patch('/remove-subcategory/:categoryId', Auth(User_Role.admin), removeSubCategory);

router.get('/', getAllCategories);

router.get('/allExchangeData',
    // Auth(User_Role.admin),     /// need to uncoment it in last moment of the work
    getAllExchangeDatabyAdmin);

router.get('/getALlMessageData',
    // Auth(User_Role.admin),     /// need to uncoment it in last moment of the work
    showALlReportMessageDataFromDBByAdmin);

router.get('/showALlExchangeServiceUserMessageDataFromDBByAdmin',
    // Auth(User_Role.admin),     /// need to uncoment it in last moment of the work
    showALlExchangeServiceUserMessageDataFromDBByAdmin);


export const categoryRoutes = router;
