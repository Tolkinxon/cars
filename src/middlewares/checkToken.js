import { ClientError, globalError } from "shokhijakhon-error-handler";
import {tokenService} from"../lib/tokenService.js";
import User from "../model/User.js";
const { verifyToken } = tokenService;

 async function checkToken(req, res, next){
    try {
        const token = req.headers.token;
        if(!token) throw new ClientError('Unauthorized!', 401);
        const verifiyToken = verifyToken(token);
        if(!isValidObjectId(verifiyToken.user_id)) throw new ClientError('User id is invalid', 400);
        const user = await User.findById(verifiyToken.user_id);
        if(!user) throw new ClientError('Invalid token!', 401);
        req.admin = verifiyToken.role == 'admin'
        req.user = user
        return next();
    } catch (error) {
        if(error.name == "TokenExpiredError") return res.status(401).json({ code: 'TOKEN_EXPIRED', status: 401 })
        globalError(error, res);        
    }
}

export default checkToken;