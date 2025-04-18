import express from 'express';
import { addSubCategory, createCategory, getAllCategories, removeSubCategory } from './admin.controller';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../User/user.constent';
import { upload } from '../../middleware/upload';

const router = express.Router();

router.post('/', Auth(User_Role.admin), createCategory);

router.patch('/:categoryId', Auth(User_Role.admin), upload.array('categoryImage', 1), addSubCategory);

router.patch('/remove-subcategory/:categoryId',Auth(User_Role.admin), removeSubCategory);

router.get('/', getAllCategories);


export const categoryRoutes = router;
 