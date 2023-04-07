import { Schema, Types, model } from "mongoose";
import mongoose from 'mongoose'

const commentSchema = new Schema({

    text: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    postId: {
        type: Types.ObjectId,
        ref: 'Post',
    },
    like: [{ type: Types.ObjectId, ref: 'User', }],
    unlike: [{ type: Types.ObjectId, ref: 'User', }],
    reply: [{ type: Types.ObjectId, ref: 'Comment', }],
    commentType: {
        type: String,
        default: "comment",
        enum: ['comment', 'reply'],
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    totalVote: {
        type: Number ,
        default: 0,
    },


}, {
    timestamps: true,
});


const commentModel = mongoose.models.Comment || model('Comment', commentSchema);

export default commentModel;