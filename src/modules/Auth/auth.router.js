
import { Router } from 'express'
import * as authController from './contoller/Auth.js';
import validation from '../../middleware/validation.js';
import * as validators from './auth.validation.js';

const router = Router();

router.post("/signup", validation(validators.signup), authController.signup);
router.post("/login", validation(validators.login), authController.login);
router.get("/confirmEmail/:token",  authController.confirmEmail);
router.get("/newConfirmEmail/:token", authController.newConfirmEmail);


export default router;