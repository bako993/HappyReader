import sqlite3 from 'sqlite3';
import httpStatus from 'http-status-codes';

const dbPath = '../server/src/webapp.db';

export function getOrders(req, res) {
    const db = new sqlite3.Database(dbPath);
    db.all('SELECT * FROM Orders', (err, rows) => {
        if (err) {
            console.error('Error retrieving orders:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve orders.' });
        } else {
            res.status(httpStatus.OK).json(rows);
        }
        db.close();
    });
}
export function getOrder(req, res) {
    const orderId = req.params.id;
    const db = new sqlite3.Database(dbPath);
    db.get('SELECT * FROM Orders WHERE order_id = ?', orderId, (err, row) => {
        if (err) {
            console.error('Error retrieving order:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve order.' });
        } else if (!row) {
            res.status(httpStatus.NOT_FOUND).json({ error: 'Order not found.' });
        } else {
            res.status(httpStatus.OK).json(row);
        }
        db.close();
    });
}
export function createOrder(req, res) {
    const {total_amount, book_id } = req.body;

    const db = new sqlite3.Database(dbPath);
    const bookQuery = 'SELECT * FROM Books WHERE book_id = ?';
    const orderQuery = `
    INSERT INTO Orders (order_date, total_amount, book_id)
    VALUES (?, ?, ?)
  `;


        // Check to see if book exists
        db.get(bookQuery, [book_id], (bookErr, bookRow) => {
            if (bookErr) {
                console.error('Error retrieving book:', bookErr);
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve book.' });
                db.close();
                return;
            }

            if (!bookRow) {
                res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid book ID.' });
                db.close();
                return;
            }

            const orderDate = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
            // Insert the order
            const params = [orderDate, total_amount, book_id];
            db.run(orderQuery, params, function (orderErr) {
                if (orderErr) {
                    console.error('Error inserting order:', orderErr);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create order.' });
                } else {
                    const orderId = this.lastID;
                    res.status(httpStatus.CREATED).json({
                        order_id: orderId,
                        order_date: orderDate,
                        total_amount,
                        book_id,
                    });
                }
                db.close();
            });
        });
}
export function updateOrder(req, res) {
    const orderId = req.params.id;
    const { order_date, total_amount, book_id } = req.body;

    if (orderId !== req.body.order_id) {
        res.status(httpStatus.BAD_REQUEST).json({ error: 'Cannot update the Order ID.' });
        return;
    }

    const db = new sqlite3.Database(dbPath);
    const query = `
        UPDATE Orders SET order_date = ?, total_amount = ?, book_id = ?
        WHERE order_id = ?
    `;
    const params = [order_date, total_amount, book_id, orderId];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error updating order:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update order.' });
        } else if (this.changes === 0) {
            res.status(httpStatus.NOT_FOUND).json({ error: 'Order not found.' });
        } else {
            res.status(httpStatus.NO_CONTENT).send();
        }
        db.close();
    });
}
export function deleteOrder(req, res) {
    const orderId = req.params.id;

    const db = new sqlite3.Database(dbPath);
    const query = `
        DELETE FROM Orders
        WHERE order_id = ?
    `;
    const params = [orderId];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error deleting order:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete order.' });
        } else if (this.changes === 0) {
            res.status(httpStatus.NOT_FOUND).json({ error: 'Order not found.' });
        } else {
            res.status(httpStatus.NO_CONTENT).send();
        }
        db.close();
    });
}
