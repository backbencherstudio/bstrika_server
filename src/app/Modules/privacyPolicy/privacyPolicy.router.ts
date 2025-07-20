import { Router } from 'express';
import { privacyController } from './privacyPolicy.controller';

const router = Router();

router.post('/', privacyController.createPrivacy);
router.get('/', privacyController.getAllPrivacy);
router.get('/:id', privacyController.getPrivacy);
router.put('/:id', privacyController.updatePrivacy);
router.delete('/:id', privacyController.deletePrivacy);

export const privacyRouter = router;
