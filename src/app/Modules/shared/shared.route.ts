import express from 'express';
import { findUsersBasedOnSubcategory, getCategory, SharedController } from './shared.controller';
import { upload } from '../../middleware/upload';

const router = express.Router();

router.get(
  '/userFindBycategory',
  findUsersBasedOnSubcategory,
);

router.get('/', getCategory);

router.post('/review', SharedController.createReview);
router.get('/review/:reciverId', SharedController.getReviewsByUser);

router.patch('/likeReview/:reviewId', SharedController.reviewLike);
router.patch('/disLinkreview/:reviewId', SharedController.reviewDisLike);

router.post('/report', upload.array('document', 1), SharedController.reportPlacedToAdmin);
router.get(
    '/report', 
    // Auth(User_Role.admin),   //======== after attached frontend then uncoment it 
    SharedController.getALlReportsFromDBByAdmin
  );
router.get('/report/:id',SharedController.getSingleReportFromDB );
router.patch('/reportAcceptOrRejectByAdmin/:reportId',SharedController.reportAcceptOrRejectByAdmin );


router.get('/getAcceptedDataForNav/:senderUserId', SharedController.getAcceptedDataForNav); //====> ( this api data show on the nav notification list )
router.get('/isReadExchange/:senderUserId', SharedController.getIsAcceptNotificationUnReadDataForEachUser); //====> ( this api length need to concat to the nav bar get request length  )

router.patch('/isReadExchange/:senderUserId', SharedController.getIsAcceptNotificationUnReadDataForEachUserIsAcceptTrue);
router.post('/exchange', SharedController.sendAndStoreExchangeRequestController);
router.get('/exchange', SharedController.getAllExchangeData);  //====>>> get chat data, filtered by "true ... for chat" "false for pending accept"

router.get('/exchange/:userId', SharedController.getAllExchangeDataFromDBForEachUser); // for user dashboard ( also show this data in nav bar )

router.patch('/exchange/:exchangeId', SharedController.chatexchangeRequestAcceptOrDeclineAPI);
router.patch('/acceptExchange/:exchangeId', SharedController.acceptExchangeController);

router.patch('/updateExchangeUpdateDateForSerial', SharedController.updateExchangeUpdateDateForSerial);





export const SharedRoutes = router;
        