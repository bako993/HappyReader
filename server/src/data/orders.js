import sqlite3 from 'sqlite3';
const dbPath = '../server/src/webapp.db';

const createOrdersTable = () => {
    const db = new sqlite3.Database(dbPath);
    db.serialize(() => {
        db.run(`
      PRAGMA foreign_keys = ON;
    `);
        db.run(`
      CREATE TABLE IF NOT EXISTS Orders (
        order_id INTEGER PRIMARY KEY,
        order_date TEXT DEFAULT (date('now', 'localtime')),
        total_amount REAL,
        book_id INTEGER,
        FOREIGN KEY (book_id) REFERENCES Books(book_id)
      )
    `, (err) => {
            if (err) {
                console.error('Error creating Orders table:', err);
            } else {
                console.log('Orders table created.');
            }
        });
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed.');
        }
    });
};

export default createOrdersTable;
