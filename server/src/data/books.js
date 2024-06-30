import sqlite3 from 'sqlite3';

const dbPath = '../server/src/webapp.db';

const createBooksTable = () => {
    const db = new sqlite3.Database(dbPath);
    db.run(`
    CREATE TABLE IF NOT EXISTS Books (
      book_id INTEGER PRIMARY KEY,
      book_name TEXT,
      author_name TEXT,
      category TEXT,
      price REAL
    )
  `, (err) => {
        if (err) {
            console.error('Error creating Books table:', err);
        } else {
            console.log('Books table created.');
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

export default createBooksTable;
