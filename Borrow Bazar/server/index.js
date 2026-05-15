const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'borrow-bazar-secret-key';

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../')));

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// --- AUTH API ---

app.post('/api/register', (req, res) => {
    const { name, email, password, college } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `INSERT INTO users (name, email, password, college) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, hashedPassword, college], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            return res.status(500).json({ message: 'Error registering user' });
        }
        res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err || !user) return res.status(400).json({ message: 'User not found' });

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, college: user.college } });
    });
});

// --- PRODUCTS API ---

app.get('/api/products', (req, res) => {
    const { category, q: search } = req.query;
    let query = `SELECT * FROM products`;
    let params = [];
    let conditions = [];

    if (category && category.trim() !== "") {
        conditions.push(`category = ?`);
        params.push(category);
    }

    if (search && search.trim() !== "") {
        conditions.push(`LOWER(name) LIKE LOWER(?)`);
        params.push(`%${search.trim()}%`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(` AND `);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: 'Error fetching products' });
        }
        console.log(`Search: q='${search}', category='${category}', results=${rows.length}`);
        res.json(rows);
    });
});

app.post('/api/products', authenticateToken, (req, res) => {
    const { name, price, img, category, type } = req.body;
    const sellerId = req.user.id;

    if (!name || !price || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `INSERT INTO products (name, price, img, category, type, seller_id) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, price, img, category, type || 'buy', sellerId], function(err) {
        if (err) return res.status(500).json({ message: 'Error listing product' });
        res.status(201).json({ message: 'Product listed successfully', productId: this.lastID });
    });
});

// --- ORDERS API ---

app.post('/api/orders', authenticateToken, (req, res) => {
    const { products, details } = req.body; // Array of { name, price, img }
    const userId = req.user.id;

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ message: 'Invalid products data' });
    }

    const stmt = db.prepare("INSERT INTO orders (user_id, product_name, price, img, details) VALUES (?, ?, ?, ?, ?)");
    products.forEach(p => {
        stmt.run(userId, p.name, p.price, p.img, details || '');
    });
    stmt.finalize();

    res.status(201).json({ message: 'Orders placed successfully' });
});

app.get('/api/orders', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `SELECT * FROM orders WHERE user_id = ? ORDER BY timestamp DESC`;

    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error fetching orders' });
        res.json(rows);
    });
});

app.delete('/api/orders/:id', authenticateToken, (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.id;

    const query = `DELETE FROM orders WHERE id = ? AND user_id = ?`;
    db.run(query, [orderId, userId], function(err) {
        if (err) return res.status(500).json({ message: 'Error canceling order' });
        if (this.changes === 0) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order canceled successfully' });
    });
});

// --- PROFILE API ---

app.get('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `SELECT id, name, email, college, profile_pic FROM users WHERE id = ?`;

    db.get(query, [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    });
});

app.put('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { name, college, profile_pic } = req.body;

    const query = `UPDATE users SET name = ?, college = ?, profile_pic = ? WHERE id = ?`;
    db.run(query, [name, college, profile_pic, userId], function(err) {
        if (err) return res.status(500).json({ message: 'Error updating profile' });
        res.json({ message: 'Profile updated successfully' });
    });
});

// --- FEEDBACK API ---

app.post('/api/feedback', (req, res) => {
    const { name, email, message } = req.body;
    const query = `INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)`;

    db.run(query, [name, email, message], function(err) {
        if (err) return res.status(500).json({ message: 'Error saving feedback' });
        res.status(201).json({ message: 'Feedback submitted' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${3000}`);
});
