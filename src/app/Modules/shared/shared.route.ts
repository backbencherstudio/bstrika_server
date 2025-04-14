import express from 'express';
import { findUsersBasedOnSubcategory, getCategory } from './shared.controller';

const router = express.Router();

router.get(
  '/userFindBycategory',
  findUsersBasedOnSubcategory,
);

router.get('/', getCategory);


export const SharedRoutes = router;
