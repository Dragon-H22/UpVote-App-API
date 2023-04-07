

import { Router } from 'express'
import * as postController from './controller/post.js';
import * as commentController from './controller/comment.js';
import auth from '../../middleware/auth.middleware.js';
import validation from '../../middleware/validation.js';
import * as validators from "./post.validation.js"
import { fileUpload, fileValidation } from '../../utils/cloudMulter.js';

const router = Router();

router.get("/", postController.getPosts);

router.post(
    "/", 
    auth,
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createPost),
    postController.createPost,
);

router.patch(
    "/:postId", 
    auth,
    fileUpload(fileValidation.image).single('image'),
    validation(validators.updatePost),
    postController.updatePost,
);

router.patch(
    "/:postId/like", 
    auth,
    validation(validators.likeOrUnlikePost),
    postController.likePost,
);

router.patch(
    "/:postId/unlike", 
    auth,
    validation(validators.likeOrUnlikePost),
    postController.unlikePost,
);

router.delete(
    "/:postId", 
    auth,
    validation(validators.deletePost),
    postController.deletePost,
);





// =================================== Comment Section =================================


router.get("/comment", commentController.getComments);

router.post(
    "/:postId/comment", 
    auth,
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createComment),
    commentController.createComment,
); 

router.post(
    "/:postId/comment/:commentId/reply", 
    auth,
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createReplyOnComment),
    commentController.createReplyOnComment,
); 

router.patch(
    "/:postId/comment/:commentId", 
    auth,
    fileUpload(fileValidation.image).single('image'),
    validation(validators.updateComment),
    commentController.updateComment,
);

router.patch(
    "/comment/:commentId/like", 
    auth,
    validation(validators.likeOrUnlikeComment),
    commentController.likeComment,
);

router.patch(
    "/comment/:commnetId/unlike", 
    auth,
    validation(validators.likeOrUnlikeComment),
    commentController.unlikeComment,
);

router.delete(
    "/comment/:commentId/", 
    auth,
    validation(validators.deleteComment),
    commentController.deleteComment,
);



export default router;