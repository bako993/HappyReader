import express from 'express';
import customerRoutes from "../src/routes/customers.js";
import bookRoutes from "../src/routes/books.js";
import orderRoutes from "../src/routes/orders.js";
import cors from 'cors';
import sqlite3 from 'sqlite3';
import createOrdersTable from './data/orders.js';
import createBooksTable from './data/books.js';
import createCustomersTable from './data/customers.js';

const dbPath = '../server/src/webapp.db';

const app = express();
const port =5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the SQLite database.');
        createOrdersTable();
        createBooksTable();
        createCustomersTable();
    }
});


app.use('/customers',customerRoutes);
app.use('/books',bookRoutes);
app.use('/orders',orderRoutes);


app.listen(port,() =>{
    console.log(`Server is running on port ${port}.`);
})

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed.');
            process.exit(0);
        }
    });
});