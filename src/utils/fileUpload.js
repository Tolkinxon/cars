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


export const deleteFile = async (publicId) => {
  try {
    const result = await v2.uploader.destroy(publicId, { resource_type: "image" });
    return result; // { result: "ok" } yoki { result: "not found" }
  } catch (err) {
    throw new Error("Cloudinary delete error: " + err.message);
  }
};
