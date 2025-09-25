import { ClientError, globalError } from "shokhijakhon-error-handler"
import User from "../model/User.js";
import { isValidObjectId } from 'mongoose';

export default {
    async GET_USER(req, res){
        try{
            const { id } = req.params;
            if(id){
                if(!isValidObjectId(id)) throw new ClientError('User id is invalid', 400);
                const findUser = await User.findById(id);
                if(!findUser) throw new ClientError('User not found', 404);
                return  res.json(findUser);
            }
            const users = await User.find();
            return res.json(users);
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async UPDATE_USER(req, res){
        try{
            const { id } = req.params;
            if(!isValidObjectId(id)) throw new ClientError('User id is invalid', 400);
            const findUser = await User.findById(id);
            if(!findUser) throw new ClientError('User not found', 404);
            const userNewData = req.body;
            await User.findByIdAndUpdate(id, userNewData)
            return res.json({message: "User successfully updated", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async DELETE_USER(req, res){
        try{
            const { id } = req.params;
            if(!isValidObjectId(id)) throw new ClientError('User id is invalid', 400);
            const findUser = await User.findById(id);
            if(!findUser) throw new ClientError('User not found', 404);
            await User.findByIdAndDelete(id);
            return res.json({message: "User successfully deleted", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
}