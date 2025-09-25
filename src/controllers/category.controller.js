import { ClientError, globalError } from "shokhijakhon-error-handler";
import Category from "../model/Category.js";
import { categorySchema } from "../utils/validator/category.validator.js";
import { isValidObjectId } from "mongoose";

export default {
    async GET_CATEGORIES(req, res){
        try{
            let categories = await Category.find();
            return res.json(categories);    
        }catch(err){
            return globalError(err, res);
        }
    },
    async CREATE_CATEGORY(req, res){
        try{
            let newCategory = req.body;
            let validate = await categorySchema.validateAsync(newCategory, {abortEarly: false});
            if(validate.error) throw new ClientError(validate.error.message, 400);
            let insertCategory = await Category.create(newCategory);
            return res.json({message: "Category successfully created !", status: 201, id: insertCategory._id});
        }catch(err){
            return globalError(err, res);
        }
    },
    async DELETE_CATEGORY(req, res){
        try{
            const id = req.params.id;
            if(!isValidObjectId(id)) throw new ClientError('Category id is invalid', 400);
            const findCategory = await Category.findById(id);
            if(!findCategory) throw new ClientError('Category not found', 404);
            await Category.findByIdAndDelete(id);
            return res.json({message: "Category successfully deleted", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
}