import { ClientError, globalError } from "shokhijakhon-error-handler"
import { serverConfig } from "../config.js";
import app from "converter-mb";

const {file:{avatar:{ formats, size }}} = serverConfig;

const avatarValidator = (req, res, next) => {
    try {
        let files = req.files;
        if(!files) return next();
        for(let file in files){
            const fileSIze = app.byte(files[file][0].size);
            if(fileSIze > size) throw new ClientError('Avatar size limit is 3mb', 413);
            if(!(formats.includes(files[file][0].mimetype))) throw new ClientError('Avatar format is invalid', 415);
        }
        return next();
    } catch (error) {
        return globalError(error, res);
    }
}

export default avatarValidator;