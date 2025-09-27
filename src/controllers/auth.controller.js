import { ClientError, globalError } from "shokhijakhon-error-handler"
import { changePasswordSchema, loginSchema, userSchema } from "../utils/validator/user.validator.js";
import User from "../model/User.js";
import  hash  from "./../lib/hash.js";
import { generateOtp } from "../utils/otp.js";
import emailService from "../lib/nodemailer.js";
import { otpSchema, resendSchema } from "../utils/validator/otp.validator.js";
import { tokenService } from "../lib/tokenService.js";


export default {
    async REGISTER(req, res){
        try {
            const newUser = req.body;
            const validate = await userSchema.validate(newUser, {abortEarly: false})
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const findUser = await User.findOne({email: newUser.email});
            if(findUser) throw new ClientError("User already exists", 400);
            const hashPassword = await hash.hashPassword(newUser.password);
            const { otp, otpTime } = generateOtp();
            await emailService(newUser.email, otp);
            const insertUser = await User.create({ ...newUser, password: hashPassword, otp, otpTime });
            return res.status(201).json({message: 'User successfully registered and we send a OTP code to your email', status: 201});
        } catch (error) {
            return globalError(error, res);
        }
    },
    async VERIFY(req, res){
        try {
            const data = req.body;
            const validate = await otpSchema.validate(data, {abortEarly: false});
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const checkUser = await User.findOne({email: data.email});
            if(!checkUser) throw new ClientError("User not found", 404);
            const currentTime = Date.now();
            if(currentTime > checkUser.otpTime) {
                await User.findOneAndUpdate({email: data.email}, {otp: null, otpTime: null});
                throw new ClientError("OTP expired", 400);
            }
            if(checkUser.otp !== data.otp) throw new ClientError('OTP invalid', 400);
            await User.findOneAndUpdate({email: data.email}, {isVerified: true});
            return res.json({message: "OTP successfully verified", status: 200});
        } catch (error) {
            return globalError(error, res);
        }
    },
    async RESEND_OTP(req, res){
        try {
            const data = req.body;
            const validate = resendSchema.validate(data);
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const checkUser = await User.findOne({email: data.email});
            if(!checkUser) throw new ClientError("User not found", 404);
            if(checkUser.isVerified) throw new ClientError("User already verified", 400);
            const {otp, otpTime} = generateOtp();
            await emailService(data.email, otp);
            await User.findOneAndUpdate({email: data.email}, {otp, otpTime});
            return res.json({message: "OTP successfully resend your email", status: 200});
        } catch (error) {
            return globalError(error, res)
        }   
    },
    async FORGOT_PASSWORD(req, res){
        try {
            const data = req.body;
            const validate = resendSchema.validate(data);
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const checkUser = await User.findOne({email: data.email});
            if(!checkUser) throw new ClientError("User not found", 404);
            await User.findOneAndUpdate({email: data.email}, {otp: null, otpTime: null, isVerified: false});
            const {otp, otpTime} = generateOtp();
            await emailService(data.email, otp);
            await User.findOneAndUpdate({email: data.email}, {otp, otpTime});
            return res.json({message: "We send OTP for change password to your email please check your email", status: 200});
        } catch (error) {
            return globalError(error, res);
        }
    },
    async CHANGE_PASSWORD(req, res){
        try {
            const data = req.body;
            const validate = await changePasswordSchema.validate(data);
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const checkUser = await User.findOne({email: data.email});
            if(!checkUser) throw new ClientError("User not found", 404);
            let hashPassword = await hash.hashPassword(data.new_password); 
            if(!checkUser.isVerified) throw new ClientError("User is not verified", 400);
            await User.findOneAndUpdate({email: data.email}, {password: hashPassword});
            return res.json({message: "Password successfully updated", status: 200});            
        } catch (error) {
            return globalError(error, res);
        }
    },
    async LOGIN(req, res){
        try{
            const user = req.body;
            const validate = await loginSchema.validate(user, {abortEarly: false});
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const findUser = await User.findOne({email: user.email});
            if(!findUser) throw new ClientError('User not found', 404);
            const checkPassword = await hash.comparePassword(user.password, findUser.password);
            if(!checkPassword) throw new ClientError('User not found', 404);
            const payload = {user_id: findUser._id, role: findUser.role};
            const accessToken = tokenService.createAccessToken(payload);
            const refreshToken = tokenService.createRefreshToken({...payload, userAgent: req.headers['user-agent']});
            findUser.refreshTokens.push({token: refreshToken, role: findUser.role, userAgent: req.headers['user-agent']});
            await findUser.save();
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure:  process.env.NODE_ENV == 'production' ?  true : false,
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({message: 'User successfully Logged in', status: 200, accessToken, role: findUser.role});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async REFRESH(req, res){
        try {
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken) throw new ClientError('Refresh token not found!' , 400);
            const parseRefreshToken = tokenService.verifyRefreshToken(refreshToken);
            if(parseRefreshToken.userAgent !== req.headers['user-agent']) throw new ClientError('Invalid refresh token !', 400);
            const findUser = await User.findById(parseRefreshToken.user_id);
            if (!findUser) throw new ClientError('Invalid refresh token', 401);
            req.user = findUser;
            req.admin = parseRefreshToken.role == 'admin' ? true : false;
            const payload = { user_id: findUser._id, role: findUser.role }
            const accessToken = tokenService.createAccessToken(payload);
            return res.json({message: 'Access token successfully generated', accessToken, status: 200, role: findUser.role});
        } catch (error) {
            return globalError(error, res);
        }
    },
    async LOGOUT(req, res){
        try {
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken) throw new ClientError('Token not found', 400);
            const findUser = await User.findOne({"refreshTokens.token": refreshToken});
            if(!findUser) {
                res.clearCookie('refreshToken', {httpOnly: true, sameSite: "strict"});
                return res.json({message: "User successfully logged out", status: 200})
            };
            findUser.refreshTokens = findUser.refreshTokens.filter((token) => token !== refreshToken);
            await findUser.save();
            res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
            return res.json({message: "User successfully logged out", status: 200})
        } catch (error) {
            return globalError(error, res);
        }
    }
}