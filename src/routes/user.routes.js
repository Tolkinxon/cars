import { Router } from "express";
import userController from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.get('/all', userController.GET_USER);
userRouter.route('/:id')
.get(userController.GET_USER)
.put(userController.UPDATE_USER)
.delete(userController.DELETE_USER);
 