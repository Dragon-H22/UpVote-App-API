

import commentModel from "../../../../DB/Models/Comment.model.js";
import postModel from "../../../../DB/Models/Post.model.js";
import userModel from "../../../../DB/Models/User.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";




export const getComments = asyncHandler(async (req, res, next) => {
    const commentList = await commentModel.find({}).populate([
        {
            path: 'reply',
            populate: [
                {
                    path: 'userId',
                    select: 'userName profilePic'
                },
                {
                    path: 'like',
                    select: 'userName profilePic'
                },
                {
                    path: 'unlike',
                    select: 'userName profilePic'
                },
            ]
        }
    ]);
    return res.json({ message: "Done", commentList});
});


export const createComment = asyncHandler(async (req, res, next) => {
    req.body.postId = req.params.postId;
    req.body.userId = req.user;
    const post = await postModel.findById(req.params.postId);
    if(!post) {
        return next(new Error('In-valid post id', { cause: 404 }))
    }
    if(req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `UpVote/Post/${req.params.postId}/comment` });
        req.body.image = { secure_url, public_id };
    }

    const comment = await commentModel.create(req.body);
    post.comment.push(comment._id);
    await post.save();
    return res.status(201).json({ message: "Done", comment});
});


export const createReplyOnComment = asyncHandler(async (req, res, next) => {
    req.body.postId = req.params.postId;
    req.body.userId = req.user;
    req.body.commentType = "reply";
    const comment = await commentModel.findOne({_id: req.params.commentId, postId: req.params.postId});
    if(!comment) {
        return next(new Error('In-valid comment id or post id', { cause: 404 }))
    }
    if(req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `UpVote/Post/${req.params.postId}/comment` });
        req.body.image = { secure_url, public_id };
    }

    const reply = await commentModel.create(req.body);
    comment.reply.push(reply._id);
    await comment.save();
    return res.status(201).json({ message: "Done", reply});
});


export const updateComment = asyncHandler(async (req, res, next) => {
    const { commentId, postId } = req.params;
    const comment = await commentModel.findOne({_id: commentId, userId: req.user._id});
    if(!comment) {
        next(new Error("In-valid comment id or user id", {cause: 400}));
    }
    if(req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `UpVote/Post/${postId}/comment` });
        req.body.image = { secure_url, public_id };

        if(comment.image) {
            await cloudinary.uploader.destroy(comment.image.public_id);
        }
    }
    comment.text = req.body.text? req.body.text : comment.text;
    comment.image = req.body.image? req.body.image : comment.image;
    await comment.save();
    return res.status(201).json({ message: "Done", comment});
});


export const likeComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const { _id } = req.user;


    const comment = await commentModel.findByIdAndUpdate(
        commentId, // where condition 
        {
            $addToSet: { like: _id},
            $pull: { unlike: _id},
        }, // change data
        { new: true }
    );
    if(!comment) {
        return next(new Error('In-valid post Id', {cause: 400}));
    }
    comment.totalVote =  comment.like.length - comment.unlike.length;
    await comment.save();
    return res.status(200).json({ message: "Done", comment});
});


export const unlikeComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const { _id } = req.user;
    
    const comment = await commentModel.findByIdAndUpdate(
        commentId, // where condition 
        {
            $addToSet: { unlike: _id},
            $pull: { like: _id},
        }, // change data
        { new: true }
    );
    if(!comment) {
        return next(new Error('In-valid post Id', {cause: 400}));
    }
    comment.totalVote =  comment.like.length - comment.unlike.length;
    await comment.save();
    return res.status(200).json({ message: "Done", comment});
});


export const deleteComment = asyncHandler(async (req, res, next) => {

    const { commentId } = req.params;
    const comment = await commentModel.findOneAndDelete({ _id: commentId, userId: req.user._id });
    if(!comment) {
        next(new Error("In-valid comment id or user id", {cause: 400}));
    }
    
    if(comment.image?.public_id) {
        // remove old photo from cloudinary
        await cloudinary.uploader.destroy(comment.image.public_id);
    }
    if(comment.reply?.length) {
        deleteCommentsOrReplys(comment.reply);
    }

    return res.status(200).json({ message: "Done"}) ;

});


// delete tree of comments and replys
export const deleteCommentsOrReplys = asyncHandler(async (comments)=>{
    for(const reply of comments) {
        const c = await commentModel.findOneAndDelete({_id: reply});
        if(c?.image?.public_id) {
            // remove old photo from cloudinary
            await cloudinary.uploader.destroy(c.image.public_id);
        }
        if(c?.reply?.length) {
            deleteCommentsOrReplys(c.reply);
        }
    }
})
