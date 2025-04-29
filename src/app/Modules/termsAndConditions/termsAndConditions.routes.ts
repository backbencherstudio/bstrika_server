import { Router } from 'express';
import { termsController } from './termsAndConditions.controller';

const router = Router();

router.post('/', termsController.createTerms);
router.get('/', termsController.getAllTerms);
router.get('/:id', termsController.getTerms);
router.put('/:id', termsController.updateTerms);
router.delete('/:id', termsController.deleteTerms);

export const termsRouter =  router;