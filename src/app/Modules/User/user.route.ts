import express from 'express';
import { upload } from '../../middleware/upload';
import { userController } from './user.controller';

const router = express.Router();

router.get(
  '/allUsers',
  // Auth(User_Role.admin),
  userController.getAllUser,
);


router.get(
  '/:userId',
  userController.getSingleUser,
);

router.post(
  '/resetPassword',
  userController.resetPassword,
);

router.patch(
  '/sendOtpForResetPassword',
  userController.verifyOtpForResetPassword,
);

router.post(
  '/create-user',
  userController.createUser,
);

router.patch(
  '/',
  upload.array('profileImage', 1), 
  userController.updateUserData,
);

router.patch(
  '/setPortfolioImage/:id',
  upload.array('portfolio', 1), 
  userController.setPortfolioImage,
);

router.delete("/deletePortfolioImage/:id", userController.deletePortfolioImage)

router.patch(
  '/setCertificate/:id',
  upload.array('cartificate', 1), 
  userController.setCartificate,
);

router.delete("/deleteCertificate/:id", userController.deleteCertificate)

router.patch("/addServices/:id", userController.addServices)
router.delete("/deleteServices/:id", userController.deleteServices)

router.patch("/addExtraSkills/:id", userController.addExtraSkills)
router.delete("/deleteExtraSkills/:id", userController.deleteExtraSkills)

router.post(
  '/login',
  userController.loginUser,
);

router.patch(
  '/userDelete',
  userController.userDelete,
);

router.post(
  '/verifyOTP',
  userController.verifyOTP,
);

router.post(
  '/refresh-token',
  userController.refreshToken,
);

router.post(
  '/sendEmail',
  userController.sendEmailToUser,
);


export const UserRouter = router;
