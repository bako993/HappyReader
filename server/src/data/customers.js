import sqlite3 from 'sqlite3';


const dbPath = '../server/src/webapp.db';

// Create the Customers table
const createCustomersTable = () => {
    const db = new sqlite3.Database(dbPath);
    db.run(`
    CREATE TABLE IF NOT EXISTS Customers (
      customer_id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      address TEXT,
      order_id INTEGER,
      FOREIGN KEY (order_id) REFERENCES Orders(order_id)
    )
  `, (err) => {
        if (err) {
            console.error('Error creating Customers table:', err);
        } else {
            console.log('Customers table created.');
        }
    });
    db.close((err) => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed.');
        }
    });
};

export default createCustomersTable;
