import { Schema, Types, model } from "mongoose";
import mongoose from 'mongoose'

const postSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    caption: String,
    image: {
        type: Object,
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    like: [{ type: Types.ObjectId, ref: 'User', }],
    unlike: [{ type: Types.ObjectId, ref: 'User', }],
    comment: [{ type: Types.ObjectId, ref: 'Comment', }],
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


const postModel = mongoose.models.Post || model('Post', postSchema);

export default postModel;