import express from 'express';
import { findUsersBasedOnSubcategory, getCategory, SharedController } from './shared.controller';

const router = express.Router();

router.get(
  '/userFindBycategory',
  findUsersBasedOnSubcategory,
);

router.get('/', getCategory);

router.post('/review', SharedController.createReview);

router.post('/exchange', SharedController.sendAndStoreExchangeRequestController);
router.get('/exchange', SharedController.getAllExchangeData);  //====>>> get chat data, filtered by "true ... for chat" "false for pending accept"

router.patch('/exchange/:exchangeId', SharedController.chatexchangeRequestAcceptOrDeclineAPI);
router.patch('/acceptExchange/:exchangeId', SharedController.acceptExchangeController);


export const SharedRoutes = router;
