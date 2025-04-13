import express from 'express';
import { Auth } from '../../middleware/auth';
import { User_Role } from './user.constent';
import { upload } from '../../middleware/upload';
import { userController } from './user.controller';

const router = express.Router();

router.get(
  '/allUsers',
  Auth(User_Role.admin),
  userController.getAllUser,
);

router.get(
  '/',
  userController.getSingleUser,
);

router.post(
  '/resetPassword',
  userController.resetPassword,
);

router.patch(
  '/verifyOtpForResetPassword',
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
