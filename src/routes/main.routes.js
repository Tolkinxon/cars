import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { categoryRouter } from "./category.routes.js";
import { userRouter } from "./user.routes.js";
import { carRouter } from "./cars.routes.js";
import checkToken from "../middlewares/checkToken.js";

export const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/category', categoryRouter);
mainRouter.use('/user', userRouter);
mainRouter.use('/car', carRouter);