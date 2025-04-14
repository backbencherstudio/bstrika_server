import express from 'express';
import { UserRouter } from '../Modules/User/user.route';
import { categoryRoutes } from '../Modules/admin/admin.route';
import { SharedRoutes } from '../Modules/shared/shared.route';
const router = express.Router();

const moduleRoutes = [
  { path: '/auth', route: UserRouter },
  { path: '/categories', route: categoryRoutes },
  { path: '/shared', route: SharedRoutes },
];

moduleRoutes.forEach((pathRouter) =>
  router.use(pathRouter.path, pathRouter.route),
);

export default router;
