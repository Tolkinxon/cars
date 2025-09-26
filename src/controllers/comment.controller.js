import { ClientError, globalError } from "shokhijakhon-error-handler"
import { isValidObjectId } from 'mongoose';
import Comment from "../model/Comment.js";
import { commentSchema, createCommentSchema } from "../utils/validator/comment.validator.js";

export default {
    async GET_COMMENT(req, res){
        try{
            const id  = req.params.id;
            if(id){
                if(!isValidObjectId(id)) throw new ClientError('Comment id is invalid', 400);
                const findComment = await Comment.findById(id);
                if(!findComment) throw new ClientError('Comment not found', 404);
                return  res.json(findComment);
            }
            const comments = await Comment.find().populate('commenter').populate('car');
            return res.json(comments);
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async CREATE_COMMENT(req, res){
        try{
            const newComment = req.body;
            const validate = await commentSchema.validateAsync(newComment, {abortEarly: false});
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const inserComment = await Comment.create(newComment);
            return res.status(201).json({message: 'Comment successfully created', status: 201, comment_id: inserComment._id});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async UPDATE_COMMENT(req, res){
        try{
            const id = req.params.id;
            if(!isValidObjectId(id)) throw new ClientError('Comment id is invalid', 400);
            const findComment = await Comment.findById(id);
            if(!findComment) throw new ClientError('Comment not found', 404);
            const commentNewData = req.body;
            const validator = createCommentSchema(commentNewData);
            const validate = validator.validateAsync(commentNewData, {abortEarly: false}); 
            if(validate.error) throw new ClientError(validate.error.message, 400);
            await Comment.findByIdAndUpdate(id, commentNewData, {new: true});
            return res.json({message: "Comment successfully updated", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async DELETE_COMMENT(req, res){
        try{
            const id = req.params.id;
            if(!isValidObjectId(id)) throw new ClientError('Comment id is invalid', 400);
            const findComment = await Comment.findById(id);
            if(!findComment) throw new ClientError('Comment not found', 404);
            await Comment.findByIdAndDelete(id);
            return res.json({message: "Comment successfully deleted", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
}