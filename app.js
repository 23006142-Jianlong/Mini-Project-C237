    const express = require('express');
    const mysql = require('mysql2');
    const session = require('express-session')
    const bodyParser = require('body-parser');
    const path = require('path');
    const app = express();


    // Set EJS as the templating engine
    app.set('view engine', 'ejs');

    // Serve static files from the "public" directory
    app.use(express.static('public'));

    // Middleware to parse request bodies
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true
    }));

    // Database connection
    const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'kululong',
    password:'Pccdc_123',
    database:'books_coding'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database');
    });

    app.use(express.urlencoded({
        extended: false
    }))

    // Include code for Middleware to parse request bodies
    app.use(bodyParser.urlencoded({extended:true}));

    // Set up middleware to serve static files from image directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Helper functions to manage cart

/*
    const addToCart = (req, manga_id) => {
        if (!req.session.cart) {
            req.session.cart = [];
        }
        req.session.cart.push(manga_id);
    };

    const getCart = (req) => {
        return req.session.cart || [];
    };

    const removeFromCart = (req, manga_id) => {
        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(id => id !== manga_id);
        }
    };
*/

    // Routing for Home-Page of the Website And getting all the books
    app.get('/', (req, res) => {
        const sql = 'SELECT * FROM manga';
        // Fetching data from MySQL
        connection.query(sql, (error, results) => {
            if (error) {
                console.error('Database query error:', error.message);
                return res.status(500).send('Error Retrieving Books');
            }
            res.render('StoreFront', { books: results });
        });
    });

    // Route to render the addBook form
    app.get('/addBook', (req, res) => {
        res.render('addBook');
    });

// Route to handle form submission for adding a new book
    app.post('/addBook', (req, res) => {
    const { title, cover_image, description, stock_quantity, price } = req.body;
    const sql = 'INSERT INTO manga (title, cover_image, description, stock_quantity, price) VALUES (?, ?, ?, ?, ?)';

    connection.query(sql, [title, cover_image, description, stock_quantity, price], (error, results) => {
        if (error) {
        console.error('Error adding Manga:', error);
        return res.status(500).send('Error adding Manga');
        } else {
        res.redirect('/');
        }
    });
    });

    // Route to render the editBook form
    app.get('/editBook/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = 'SELECT * FROM manga WHERE manga_id = ?';

    connection.query(sql, [bookId], (error, results) => {
        if (error) {
        console.error('Database query error:', error.message);
        return res.status(500).send('Error Retrieving Book');
        }
        if (results.length === 0) {
        return res.status(404).send('Book Not Found');
        }
        res.render('EditBook', { book: results[0] });
    });
    });

    // Route to handle form submission for editing a book
    app.post('/editBook/:id', (req, res) => {
    const bookId = req.params.id;
    const { title, cover_image, description, stock_quantity, price } = req.body;
    const sql = 'UPDATE manga SET title = ?, cover_image = ?, description = ?, stock_quantity = ?, price = ? WHERE manga_id = ?';

    connection.query(sql, [title, cover_image, description, stock_quantity, price, bookId], (error, results) => {
        if (error) {
        console.error('Error updating Manga:', error);
        return res.status(500).send('Error updating Manga');
        } else {
        res.redirect('/');
        }
    });
    });

    // Route to render the viewBook page
    app.get('/viewBook/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = 'SELECT * FROM manga WHERE manga_id = ?';

    connection.query(sql, [bookId], (error, results) => {
        if (error) {
        console.error('Database query error:', error.message);
        return res.status(500).send('Error Retrieving Book');
        }
        if (results.length === 0) {
        return res.status(404).send('Book Not Found');
        }
        res.render('ViewBook', { book: results[0] });
    });
    });

    // Route to handle book deletion
    app.get('/deleteBook/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = 'DELETE FROM manga WHERE manga_id = ?';

    connection.query(sql, [bookId], (error, results) => {
        if (error) {
        console.error('Error deleting Manga:', error);
        return res.status(500).send('Error deleting Manga');
        } else {
        res.redirect('/');
        }
    });
});

/*
    // Route to handle adding items to the cart
    app.post('/addToCart', (req, res) => {
        const manga_id = req.body.manga_id;
        addToCart(req, manga_id);
        res.redirect('/addToCart');
    });

    // Route to render the cart
    app.get('/addToCart', (req, res) => {
        const cart = getCart(req);
        const sql = 'SELECT * FROM manga WHERE manga_id IN (?)';
        
        if (cart.length === 0) {
            res.render('addToCart', { cart: [] });
        } else {
            connection.query(sql, [cart], (error, results) => {
                if (error) {
                    console.error('Database query error:', error.message);
                    return res.status(500).send('Error Retrieving Cart Items');
                }
                res.render('addToCart', { cart: results });
            });
        }
    });

    // Route to handle removing items from the cart
    app.get('/removeFromCart/:manga_id', (req, res) => {
        const manga_id = req.params.manga_id;
        removeFromCart(req, manga_id);
        res.redirect('/addToCart');
});

    app.get('/aboutus', (req, res) => {
        res.render('aboutus');
});
*/

// Port 
const PORT = process.env.PORT || 3005;
// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
