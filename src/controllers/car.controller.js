import { ClientError, globalError } from "shokhijakhon-error-handler"
import { isValidObjectId } from 'mongoose';
import { carSchema } from "../utils/validator/car.validator.js";
import Category from "../model/Category.js";
import { cloudinaryFolderPath, uploadFile } from "../utils/fileUpload.js";
import Car from "../model/Car.js";

export default {
    async GET_CAR(req, res){
        try{
            const id  = req.params.id;
            if(id){
                if(!isValidObjectId(id)) throw new ClientError('CAR id is invalid', 400);
                const findCAR = await CAR.findById(id).populate('author', {full_name: 1, _id: 0});
                if(!findCAR) throw new ClientError('CAR not found', 404);
                return  res.json(findCAR);
            }
            const CARs = await CAR.find().populate('author', {full_name: 1, _id: 0});
            return res.json(CARs);
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async CREATE_CAR(req, res){
        try{
            const newCar = req.body;
            const validate = await carSchema.validateAsync(newCar, {abortEarly: false});
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const checkCar = await Car.find({$text: {$search: newCar.title}});
            if(checkCar.length) throw new ClientError('Car already exists', 400);
            console.log(req.files);
            
            let brand_image = null;
            let public_id = null;
            // if(req.file) {
            //     const data = await uploadFile(req.file.buffer, cloudinaryFolderPath.CARs);
            //     cover_image = await data.secure_url
            //     public_id = await data.public_id
            // }
            // const inserCAR = await CAR.create({...newCar, cover_image, public_id});
            return res.status(201).json({message: 'CAR successfully created', status: 201});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async UPDATE_CAR(req, res){
        try{
            const id = req.params.id;
            if(!isValidObjectId(id)) throw new ClientError('CAR id is invalid', 400);
            const findCAR = await CAR.findById(id);
            if(!findCAR) throw new ClientError('CAR not found', 404);
            const CARNewData = req.body;
            const validator = createCARSchema(CARNewData);
            const validate = validator.validateAsync(CARNewData, {abortEarly: false}); 
            if(validate.error) throw new ClientError(validate.error.message, 400);
            await CAR.findByIdAndUpdate(id, CARNewData, {new: true});
            return res.json({message: "CAR successfully updated", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async DELETE_CAR(req, res){
        try{
            const id = req.params.id;
            if(!isValidObjectId(id)) throw new ClientError('CAR id is invalid', 400);
            const findCAR = await CAR.findById(id);
            if(!findCAR) throw new ClientError('CAR not found', 404);
            await CAR.findByIdAndDelete(id);
            return res.json({message: "CAR successfully deleted", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async SEARCH_CAR(req, res){
        try {
        const categoryId = req.query?.categoryId?.trim();
            if(categoryId) {
                if(!isValidObjectId(categoryId)) throw new ClientError('Category id is invalid', 400);
                const checkCategory = await Category.findById(categoryId);
                if(!checkCategory) throw new ClientError('Invalid object id', 400);
                const CARs = await CAR.find({period: categoryId}).populate('period').populate('author', {full_name: 1});
                return res.json(CARs)
            }
            const searchValue = req.query?.title?.trim();
            if(!searchValue) throw new ClientError("Search value is empty", 400);
            // const CARs = await CAR.find({title: {$regex: searchValue, $options: 'i'}});
            const CARs = await CAR.find({$text: {$search: searchValue}}).populate('author', {full_name: 1});;
            return res.json(CARs);            
        } catch (error) {
            return globalError(error, res);
        }
    }
}