import { Router } from "express";
import authController from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post('/register', authController.REGISTER);
authRouter.post('/verify', authController.VERIFY);
authRouter.post('/resend-otp', authController.RESEND_OTP);
authRouter.post('/forgot-password', authController.FORGOT_PASSWORD);
authRouter.post('/change-password', authController.CHANGE_PASSWORD);