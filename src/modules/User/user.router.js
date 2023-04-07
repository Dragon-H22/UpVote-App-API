
import { Router } from 'express'
import * as userController from './controller/user.js';
import auth from './../../middleware/auth.middleware.js';
import validation from '../../middleware/validation.js';
import * as validators from "./user.validation.js"
import { fileUpload, fileValidation } from '../../utils/cloudMulter.js';

const router = Router();

router.get("/", userController.getUserModule);

router.get("/profile", auth, userController.profile);

router.get(
    "/:id/profile", 
    validation(validators.shareProfile), 
    userController.shareProfile
);

router.patch(
    "/password", 
    validation(validators.updatePassword), 
    auth, 
    userController.updatePassword
);

router.patch(
    "/profilePic", 
    fileUpload(fileValidation.image).single('image'), 
    validation(validators.profilePic),
    auth, 
    userController.profilePic
);

router.patch(
    "/profileCovPic", 
    fileUpload(fileValidation.image).array('image', 5), 
    auth, 
    validation(validators.profileCovPic),
    userController.profileCovPic
);



export default router;