import express from 'express';
import { UserRouter } from '../Modules/User/user.route';
import { categoryRoutes } from '../Modules/admin/admin.route';
import { SharedRoutes } from '../Modules/shared/shared.route';
import { termsRouter } from '../Modules/termsAndConditions/termsAndConditions.routes';
import { privacyRouter } from '../Modules/privacyPolicy/privacyPolicy.router';
const router = express.Router();

const moduleRoutes = [
  { path: '/auth', route: UserRouter },
  { path: '/categories', route: categoryRoutes },
  { path: '/shared', route: SharedRoutes },
  { path: '/terms', route: termsRouter },
  { path: '/privacy', route: privacyRouter },
];

moduleRoutes.forEach((pathRouter) =>
  router.use(pathRouter.path, pathRouter.route),
);

export default router;
