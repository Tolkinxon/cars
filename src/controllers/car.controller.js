import { ClientError, globalError } from "shokhijakhon-error-handler"
import { isValidObjectId } from 'mongoose';
import Book from "../model/Book.js";
import { bookSchema, createBookSchema } from "../utils/validator/book.validator.js";
import Category from "../model/Category.js";
import { cloudinaryFolderPath, uploadFile } from "../utils/fileUpload.js";

export default {
    async GET_BOOK(req, res){
        try{
            const id  = req.params.id;
            if(id){
                if(!isValidObjectId(id)) throw new ClientError('Book id is invalid', 400);
                const findBook = await Book.findById(id).populate('author', {full_name: 1, _id: 0});
                if(!findBook) throw new ClientError('Book not found', 404);
                return  res.json(findBook);
            }
            const books = await Book.find().populate('author', {full_name: 1, _id: 0});
            return res.json(books);
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async CREATE_BOOK(req, res){
        try{
            const newBook = req.body;
            const validate = await bookSchema.validateAsync(newBook, {abortEarly: false});
            if(validate.error) throw new ClientError(validate.error.message, 400);
            const checkBook = await Book.find({$text: {$search: newBook.title}});
            if(checkBook.length) throw new ClientError('Book already exists', 400);
            let cover_image = null;
            let public_id = null;
            if(req.file) {
                const data = await uploadFile(req.file.buffer, cloudinaryFolderPath.books);
                cover_image = await data.secure_url
                public_id = await data.public_id
            }
            const inserBook = await Book.create({...newBook, cover_image, public_id});
            return res.status(201).json({message: 'Book successfully created', status: 201, book_id: inserBook._id});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async UPDATE_BOOK(req, res){
        try{
            const id = req.params.id;
            if(!isValidObjectId(id)) throw new ClientError('Book id is invalid', 400);
            const findBook = await Book.findById(id);
            if(!findBook) throw new ClientError('Book not found', 404);
            const bookNewData = req.body;
            const validator = createBookSchema(bookNewData);
            const validate = validator.validateAsync(bookNewData, {abortEarly: false}); 
            if(validate.error) throw new ClientError(validate.error.message, 400);
            await Book.findByIdAndUpdate(id, bookNewData, {new: true});
            return res.json({message: "Book successfully updated", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async DELETE_BOOK(req, res){
        try{
            const id = req.params.id;
            if(!isValidObjectId(id)) throw new ClientError('Book id is invalid', 400);
            const findBook = await Book.findById(id);
            if(!findBook) throw new ClientError('Book not found', 404);
            await Book.findByIdAndDelete(id);
            return res.json({message: "Book successfully deleted", status: 200});
        }
        catch(error){
            return globalError(error, res);
        }
    },
    async SEARCH_BOOK(req, res){
        try {
        const categoryId = req.query?.categoryId?.trim();
            if(categoryId) {
                if(!isValidObjectId(categoryId)) throw new ClientError('Category id is invalid', 400);
                const checkCategory = await Category.findById(categoryId);
                if(!checkCategory) throw new ClientError('Invalid object id', 400);
                const books = await Book.find({period: categoryId}).populate('period').populate('author', {full_name: 1});
                return res.json(books)
            }
            const searchValue = req.query?.title?.trim();
            if(!searchValue) throw new ClientError("Search value is empty", 400);
            // const books = await Book.find({title: {$regex: searchValue, $options: 'i'}});
            const books = await Book.find({$text: {$search: searchValue}}).populate('author', {full_name: 1});;
            return res.json(books);            
        } catch (error) {
            return globalError(error, res);
        }
    }
}