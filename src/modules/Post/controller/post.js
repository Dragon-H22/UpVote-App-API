
import postModel from "../../../../DB/Models/Post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { deleteCommentsOrReplys } from "./comment.js";



// export const getPosts = asyncHandler(async (req, res, next) => {

//     // Bad Way
//     // const posts = await postModel.find({}).populate([
//     //     {
//     //         path: 'userId',
//     //         select: 'userName profilePic'
//     //     },
//     //     {
//     //         path: 'like',
//     //         select: 'userName profilePic'
//     //     },
//     //     {
//     //         path: 'unlike',
//     //         select: 'userName profilePic'
//     //     },
//     // ])
//     // const postList = []
//     // for(const post of posts) {
//     //     const comment = await commentModel.find({postId: post._id});
//     //     postList.push({post, comment});
//     // }
    
    
//     const posts =  postModel.find({}).populate([
//         {
//             path: 'userId',
//             select: 'userName profilePic'
//         },
//         {
//             path: 'like',
//             select: 'userName profilePic'
//         },
//         {
//             path: 'unlike',
//             select: 'userName profilePic'
//         },
//     ]).sort({totalVote: -1}).cursor();
//     const postList = []
//     for(let post = await posts.next() ; post != null ; post = await posts.next()) {
//         const comment = await commentModel.find({postId: post._id});
//         postList.push({post, comment});
//     }


//     return res.json({ message: "Done", posts});
// });


export const getPosts = asyncHandler(async (req, res, next) => {

    const posts = await postModel.find({}).populate([
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
        {
            path: 'comment',
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
            ],
        },
    ]);


    return res.json({ message: "Done", posts});
});


export const createPost = asyncHandler(async (req, res, next) => {
    const { title, caption } = req.body;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `UpVote/Post` });
    const post = await postModel.create({
        title, 
        caption,
        image: { secure_url, public_id },
        userId: req.user._id,
    });
    return res.status(201).json({ message: "Done", post});
});


export const updatePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    // console.log(req.body.title);
    const post = await postModel.findOne({_id: postId, userId: req.user._id});
    if(!post) {
        next(new Error("In-valid post id or user id", {cause: 400}));
    }

    if(req.file) {
        // uploade new photo
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `UpVote/Post` });
        req.body.image = { secure_url, public_id };

        if(post.image) {
            // remove old photo from cloudinary
            await cloudinary.uploader.destroy(post.image.public_id);
        }
    }

    post.image = req.body.image? req.body.image: post.image;
    post.title = req.body.title? req.body.title: post.title;
    post.caption = req.body.caption? req.body.caption: post.caption;
    await post.save();
    
    return res.status(201).json({ message: "Done", post});
});


export const likePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const { _id } = req.user;

    // fist way
    // const post = await postModel.findOneAndUpdate(
    //     {
    //         _id: postId,
    //         like: { $nin: _id },
    //     }, // where condition 
    //     {
    //         $push: { like: _id},
    //         $pull: { unlike: _id},
    //     }, // change data
    //     {
    //         new: true,
    //     }
    // );

    const post = await postModel.findByIdAndUpdate(
        postId, // where condition 
        {
            $addToSet: { like: _id},
            $pull: { unlike: _id},
        }, // change data
        { new: true }
    );
    if(!post) {
        return next(new Error('In-valid post Id', {cause: 400}));
    }
    post.totalVote =  post.like.length - post.unlike.length;
    await post.save();
    return res.status(200).json({ message: "Done", post});
});


export const unlikePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const { _id } = req.user;

    // first way
    // const post = await postModel.findOneAndUpdate(
    //     {
    //         _id: postId,
    //         unlike: { $nin: _id },
    //     }, // where condition 
    //     {
    //         $push: { unlike: _id},
    //         $pull: { like: _id},
    //     }, // change data
    //     {
    //         new: true,
    //     }
    // );
    
    const post = await postModel.findByIdAndUpdate(
        postId, // where condition 
        {
            $addToSet: { unlike: _id},
            $pull: { like: _id},
        }, // change data
        { new: true }
    );
    if(!post) {
        return next(new Error('In-valid post Id', {cause: 400}));
    }
    post.totalVote =  post.like.length - post.unlike.length;
    await post.save();
    return res.status(200).json({ message: "Done", post});
});


export const deletePost = asyncHandler(async (req, res, next) => {

    const { postId } = req.params;
    console.log(postId);

    const post = await postModel.findOneAndDelete({_id: postId, userId: req.user._id});

    if(!post) {
        next(new Error("In-valid post id or user id", {cause: 400}));
    }
    console.log(post);

    if(post?.image?.public_id) {
        // remove old photo from cloudinary
        await cloudinary.uploader.destroy(post.image.public_id);
    }
    if(post?.comment?.length) {
        deleteCommentsOrReplys(post.comment);
    }

    return res.status(200).json({ message: "Done"});
});



