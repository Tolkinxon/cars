import { ClientError, globalError } from "shokhijakhon-error-handler"
import serverConfig from "../config.js";
import app from "converter-mb";

const {file:{avatar:{ formats, size }}} = serverConfig;

const avatarValidator = (req, res, next) => {
    try {
        let file = req.file;
        if(!file) return next();
        const fileSIze = app.byte(file.size);
        if(fileSIze > size) throw new ClientError('Avatar size limit is 3mb', 413);
        if(!(formats.includes(file.mimetype))) throw new ClientError('Avatar format is invalid', 415);
        return next();
    } catch (error) {
        return globalError(error, res);
    }
}

export default avatarValidator;