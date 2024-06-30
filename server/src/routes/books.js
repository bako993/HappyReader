import express from "express";
import { getBooks, getBook, createBook, updateBookInfo, deleteBook } from "../controllers/books.js";
const router = express.Router();


router.get('/',getBooks);
router.get('/:id',getBook);
router.post('/',createBook);
router.put('/:id',updateBookInfo);
router.delete('/:id',deleteBook);

export default router;