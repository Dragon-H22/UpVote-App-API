

import joi from 'joi'
import { generalFields } from '../../middleware/validation.js';

export const createPost = {
    body: joi.object({
        title: joi.string().min(5).max(1500).required(),
        caption: joi.string().min(3).max(15000),
    }).required(),
    file: generalFields.file.required(),
};

export const updatePost = {
    body: joi.object({
        title: joi.string().min(5).max(1500),
        caption: joi.string().min(3).max(15000),
    }).required(),
    file: generalFields.file,
};


export const likeOrUnlikePost = {
    params: joi.object({
        postId: generalFields.id,
    }).required(),
};


export const deletePost = {
    params: joi.object({
        postId: generalFields.id,
    }).required(),
};







// =================== Comments ===================

export const createComment = {
    body: joi.object({
        text: joi.string().min(5).max(15000).required(),
    }).required(),
    params: joi.object({
        postId: generalFields.id,
    }).required(),
    file: generalFields.file,
};


export const createReplyOnComment = {
    body: joi.object({
        text: joi.string().min(5).max(15000).required(),
    }).required(),
    params: joi.object({
        postId: generalFields.id,
        commentId: generalFields.id,
    }).required(),
    file: generalFields.file,
};


export const updateComment = {
    body: joi.object({
        text: joi.string().min(5).max(15000),
    }).required(),
    params: joi.object({
        commentId: generalFields.id,
        postId: generalFields.id,
    }).required(),
    file: generalFields.file,
};


export const likeOrUnlikeComment = {
    params: joi.object({
        commentId: generalFields.id,
    }).required(),
};


export const deleteComment = {
    params: joi.object({
        commentId: generalFields.id,
    }).required(),
};

