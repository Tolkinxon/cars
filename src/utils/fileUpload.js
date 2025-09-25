import { v2 } from "cloudinary";

export const cloudinaryFolderPath = {
    authors: 'books/Authors',
    books: 'books/Books'
}

export let uploadFile = async (fileBuffer, folderPath) => {
    let result = await new Promise((resolve, reject)=>{
        let stream = v2.uploader.upload_stream(
            {folder: folderPath}, 
            (err, result)=>{
                if(err) return reject(err)
                return resolve(result)
            }
        );
        stream.end(fileBuffer)
    })
    return {secure_url: result.secure_url, public_id: result.public_id}
}

