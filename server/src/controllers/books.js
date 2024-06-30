import httpStatus from 'http-status-codes';
import sqlite3 from "sqlite3";

const dbPath = '../server/src/webapp.db';

export function getBooks(req, res) {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to connect to the database.'
            });
            return;
        }

        const query = 'SELECT * FROM Books';

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error fetching books:', err);
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error: 'Failed to fetch books from the database.'
                });
                db.close();
                return;
            }

            if (rows.length === 0) {
                res.status(httpStatus.NOT_FOUND).json({
                    message: 'No books were found in the database.'
                });
            } else {
                res.status(httpStatus.OK).json(rows);
            }

            db.close();
        });
    });
}
export function getBook(req, res) {
    const bookId = req.params.id;
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to connect to the database.'
            });
            return;
        }

        const query = 'SELECT * FROM Books WHERE book_id = ?';

        db.get(query, [bookId], (err, row) => {
            if (err) {
                console.error('Error retrieving book:', err);
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error: 'Failed to retrieve book from the database.'
                });
                db.close();
                return;
            }

            if (!row) {
                res.status(httpStatus.NOT_FOUND).json({
                    error: 'Book was not found.'
                });
            } else {
                res.status(httpStatus.OK).json(row);
            }

            db.close();
        });
    });
}
export function createBook(req, res) {
    const { book_name, author_name, category, price } = req.body;

    if (!book_name || !author_name || !category || !price) {
        res.status(httpStatus.BAD_REQUEST).json({ error: 'Missing required fields.' });
        return;
    }

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to connect to the database.'
            });
            return;
        }

        const query = `
            INSERT INTO Books (book_name, author_name, category, price)
            VALUES (?, ?, ?, ?)
        `;
        const params = [book_name, author_name, category, price];

        db.run(query, params, function (err) {
            if (err) {
                console.error('Error inserting book:', err);
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error: 'Failed to create book in the database.'
                });
            } else {
                const bookId = this.lastID;
                res.status(httpStatus.CREATED).json({
                    book_id: bookId,
                    book_name,
                    author_name,
                    category,
                    price
                });
            }

            db.close();
        });
    });
}
export function updateBookInfo(req, res) {
    const bookId = req.params.id;
    const { book_name, author_name, category, price } = req.body;

    if (bookId !== req.body.book_id) {
        res.status(httpStatus.BAD_REQUEST).json({ error: 'Cannot update the book ID.' });
        return;
    }

    const db = new sqlite3.Database(dbPath);
    const query = `
        UPDATE Books SET book_name = ?, author_name = ?, category = ?, price = ?
        WHERE book_id = ?
    `;
    const params = [book_name, author_name, category, bookId];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error updating book:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update book.' });
        } else if (this.changes === 0) {
            res.status(httpStatus.NOT_FOUND).json({ error: 'Book was not found.' });
        } else {
            res.status(httpStatus.OK).json({ book_id: bookId, book_name, author_name, category, price });
        }
        db.close();
    });
}
export function deleteBook(req, res) {
    const bookId = req.params.id;

    const db = new sqlite3.Database(dbPath);
    const query = `
        DELETE FROM Books
        WHERE book_id = ?
    `;
    const params = [bookId];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error deleting book:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete book.' });
        } else if (this.changes === 0) {
            res.status(httpStatus.NOT_FOUND).json({ error: 'Book was not found.' });
        } else {
            res.status(httpStatus.NO_CONTENT).send();
        }
        db.close();
    });
}



