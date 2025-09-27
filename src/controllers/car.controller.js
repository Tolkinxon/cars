import { ClientError, globalError } from "shokhijakhon-error-handler"
import { isValidObjectId } from 'mongoose';
import { carSchema, createCarSchema } from "../utils/validator/car.validator.js";
import Category from "../model/Category.js";
import { cloudinaryFolderPath, deleteFile, uploadFile } from "../utils/fileUpload.js";
import Car from "../model/Car.js";
import mongoose from "mongoose";

export default {
    async GET_CAR(req, res) {
        try {
            const id = req.params.id;
            if (id) {
                if (!isValidObjectId(id)) throw new ClientError('Car id is invalid', 400);
                const findCar = await Car.findById(id).populate('brand', { name: 1, _id: 1 });
                if (!findCar) throw new ClientError('Car not found', 404);
                return res.json(findCar);
            }
            const cars = await Car.find().populate('brand', { name: 1, _id: 1 });
            return res.json(cars);
        }
        catch (error) {
            return globalError(error, res);
        }
    },
    async CREATE_CAR(req, res) {
        try {
            let newCar = req.body;
            // newCar.brand = new mongoose.Types.ObjectId(req.body.brand);
            newCar.tinting = newCar.tinting == 'no' ? newCar.tinting = false : newCar.tinting = true;
            const validate = await carSchema.validateAsync(newCar, { abortEarly: false });
            if (validate.error) throw new ClientError(validate.error.message, 400);
            if (req.files) {
                for (let key in req.files) {
                    const data = await uploadFile(req.files[key][0].buffer, cloudinaryFolderPath.books);
                    newCar[key] = data
                }
            }
            const insertCar = await Car.create(newCar);
            return res.status(201).json({ message: 'Car successfully created', status: 201 });
        }
        catch (error) {
            return globalError(error, res);
        }
    },
    async UPDATE_CAR(req, res) {
        try {
            let id = req.params.id;
            if (!isValidObjectId(id)) throw new ClientError('Car id is invalid', 400);
            const findCar = await Car.findById(id);
            if (!findCar) throw new ClientError('Car not found', 404);
            let carNewData = req.body;
            console.log(carNewData);
            
            if(carNewData.tinting) carNewData.tinting = carNewData.tinting == 'no' ? carNewData.tinting = false : carNewData.tinting = true;
            const validator = createCarSchema(carNewData);
            const validate = await validator.validateAsync(carNewData, { abortEarly: false });
            if (validate.error) throw new ClientError(validate.error.message, 400);
            for(let name in carNewData){
                if(name.includes('image')) {
                    if(carNewData[name] == '') delete carNewData[name]
                }
            }
            if (req.files) {
                for (let key in req.files) {
                    if(findCar[key].public_id){
                        await deleteFile(findCar[key].public_id);
                    }
                    const data = await uploadFile(req.files[key][0].buffer, cloudinaryFolderPath.books);
                    carNewData[key] = data
                }
            }
            await Car.findByIdAndUpdate(id, carNewData, { new: true });
            return res.json({ message: "CAR successfully updated", status: 200 });
        }
        catch (error) {
            return globalError(error, res);
        }
    },
    async DELETE_CAR(req, res) {
        try {
            const id = req.params.id;
            if (!isValidObjectId(id)) throw new ClientError('CAR id is invalid', 400);
            const findCar = await Car.findById(id);
            if (!findCar) throw new ClientError('Car not found', 404);

            if (findCar.brand_image.public_id) await deleteFile(findCar.brand_image.public_id);
            if (findCar.inner_image.public_id) await deleteFile(findCar.inner_image.public_id);
            if (findCar.outer_image.public_id) await deleteFile(findCar.outer_image.public_id);


            await Car.findByIdAndDelete(id);
            return res.json({ message: "Car successfully deleted", status: 200 });
        }
        catch (error) {
            return globalError(error, res);
        }
    },
    async SEARCH_CAR(req, res) {
        try {
            const categoryId = req.query?.categoryId?.trim();
            if (categoryId) {
                if (!isValidObjectId(categoryId)) throw new ClientError('Category id is invalid', 400);
                const checkCategory = await Category.findById(categoryId);
                if (!checkCategory) throw new ClientError('Invalid object id', 400);
                const cars = await Car.find({ brand: categoryId }).populate('brand');
                return res.json(cars)
            }
            const searchValue = req.query?.title?.trim();
            if (!searchValue) throw new ClientError("Search value is empty", 400);
            const cars = await Car.find({title: {$regex: searchValue, $options: 'i'}});
            // const cars = await Car.find({ $text: { $search: searchValue } }).populate('brand');;
            return res.json(cars);
        } catch (error) {
            return globalError(error, res);
        }
    }
}