import { Router } from 'express';
import categoryController from '../controllers/category.controller.js';


export const categoryRouter = Router();

categoryRouter.get('/all', categoryController.GET_CATEGORIES);
categoryRouter.post('/create', categoryController.CREATE_CATEGORY);
categoryRouter.delete('/delete/:id', categoryController.DELETE_CATEGORY);