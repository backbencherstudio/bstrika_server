import express from 'express';
import { findUsersBasedOnSubcategory, getCategory, ReviewController } from './shared.controller';

const router = express.Router();

router.get(
  '/userFindBycategory',
  findUsersBasedOnSubcategory,
);

router.get('/', getCategory);

router.post('/review', ReviewController.createReview);


export const SharedRoutes = router;
