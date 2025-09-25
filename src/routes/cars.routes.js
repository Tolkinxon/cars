import { Router } from "express";
import carController from "../controllers/car.controller.js";
import avatarValidator from "../middlewares/avatarValidator.js";
import { upload } from "../lib/cloudinary.js";

export const carRouter = Router();

// carRouter.get('/all', carController.GET_CAR);
// carRouter.get('/search', carController.SEARCH_CAR);
// carRouter.route('/:id')
// .get(carController.GET_CAR)
// .put(carController.UPDATE_CAR)
// .delete(carController.DELETE_CAR);
carRouter.post('/create', upload.fields([{ name: 'brand_image', maxCount: 1 },{ name: 'inner_image', maxCount: 1 },{ name: 'outer_image', maxCount: 1 }]), carController.CREATE_CAR);
 