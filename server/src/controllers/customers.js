import sqlite3 from 'sqlite3';
import httpStatus from 'http-status-codes';

const dbPath = '../server/src/webapp.db';

export function getCustomers(req, res) {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to connect to the database.' });
            return;
        }
        const query = 'SELECT * FROM Customers';
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error retrieving customers:', err);
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve customers from the database.' });
                db.close();
                return;
            }
            if (rows.length === 0) {
                res.status(httpStatus.NOT_FOUND).json({ error: 'No customers found in the database.' });
            } else {
                res.status(httpStatus.OK).json(rows);
            }
            db.close();
        });
    });
}
export function getCustomer(req, res) {
    const customerId = req.params.id;
    const db = new sqlite3.Database(dbPath);
    db.get('SELECT * FROM Customers WHERE customer_id = ?', customerId, (err, row) => {
        if (err) {
            console.error('Error retrieving customer:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve customer.' });
        } else if (!row) {
            res.status(httpStatus.NOT_FOUND).json({ error: 'Customer not found.' });
        } else {
            res.status(httpStatus.OK).json(row);
        }
        db.close();
    });
}
export function createCustomer(req, res) {
    const { name, email, address } = req.body;

    const db = new sqlite3.Database(dbPath);
    const query = `
    INSERT INTO Customers (name, email, address)
    VALUES (?, ?, ?)
  `;
    const params = [name, email, address, ];

    if (!name || !email || !address) {
        res.status(httpStatus.BAD_REQUEST).json({ error: 'Please provide name, email, address, and order_id.' });
        return;
    }

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error inserting customer:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create customer.' });
        } else {
            const customerId = this.lastID;
            res.status(httpStatus.CREATED).json({ customer_id: customerId, name, email, address });
        }
        db.close();
    });
}
export function updateCustomerInfo(req, res) {
    const customerId = req.params.id;
    const { name, email, address } = req.body;

    if (customerId !== req.body.customer_id) {
        res.status(httpStatus.BAD_REQUEST).json({ error: 'Cannot update the Customer ID.' });
        return;
    }

    const db = new sqlite3.Database(dbPath);
    const query = `
        UPDATE Customers SET name = ?, email = ?, address = ?
        WHERE customer_id = ?
    `;
    const params = [name, email, address, customerId];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error updating customer:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update customer.' });
        } else if (this.changes === 0) {
            res.status(httpStatus.NOT_FOUND).json({ error: 'Customer not found.' });
        } else {
            res.status(httpStatus.OK).json({ customer_id: customerId, name, email, address });
        }
        db.close();
    });
}
export function deleteCustomer(req, res) {
    const customerId = req.params.id;

    const db = new sqlite3.Database(dbPath);
    const query = `
        DELETE FROM Customers
        WHERE customer_id = ?
    `;
    const params = [customerId];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error deleting customer:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete customer.' });
        } else if (this.changes === 0) {
            res.status(httpStatus.NOT_FOUND).json({ error: 'Customer not found.' });
        } else {
            res.status(httpStatus.NO_CONTENT).send();
        }
        db.close();
    });
}