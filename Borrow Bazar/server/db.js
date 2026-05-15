const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        college TEXT,
        profile_pic TEXT
    )`);

    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        img TEXT,
        category TEXT,
        type TEXT DEFAULT 'buy',
        seller_id INTEGER,
        FOREIGN KEY (seller_id) REFERENCES users (id)
    )`);

    // Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_name TEXT,
        price REAL,
        img TEXT,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Feedback Table
    db.run(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed Products - Unique list with varied images
    const products = [
        // Cycles
        { name: "Mountain Cycle", price: 5000, img: "images/cycle1.jpg", category: "cycle", type: "buy" },
        { name: "Road Cycle", price: 6500, img: "images/cycle2.jpg", category: "cycle", type: "buy" },
        { name: "Foldable Cycle", price: 8500, img: "images/cycle3.jpg", category: "cycle", type: "buy" },
        
        // Books
        { name: "Data Structures & Algorithms", price: 300, img: "images/book1.jpg", category: "book", type: "buy" },
        { name: "Operating System Concepts", price: 350, img: "images/book2.jpg", category: "book", type: "buy" },
        { name: "DBMS Fundamentals", price: 280, img: "images/book3.jpg", category: "book", type: "buy" },
        { name: "Calculus - Early Transcendentals", price: 450, img: "images/book1.jpg", category: "book", type: "buy" },
        { name: "Python for Beginners", price: 550, img: "images/book2.jpg", category: "book", type: "buy" },
        
        // Clothes
        { name: "Premium Formal Suit", price: 800, img: "images/cloth1.jpg", category: "cloth", type: "rent" },
        { name: "Designer Winter Jacket", price: 600, img: "images/cloth2.jpg", category: "cloth", type: "buy" },
        { name: "Traditional Party Wear", price: 900, img: "images/cloth3.jpg", category: "cloth", type: "rent" },
        { name: "Campus Limited Edition Hoodie", price: 1200, img: "images/cloth1.jpg", category: "cloth", type: "buy" },
        
        // Notes
        { name: "Physics Handwritten Notes", price: 100, img: "images/notes.jpg", category: "notes", type: "buy" },
        { name: "Mathematics Formula Sheet", price: 50, img: "images/notes.jpg", category: "notes", type: "buy" },
        { name: "Engineering Graphics Guide", price: 600, img: "images/notes.jpg", category: "notes", type: "buy" },
        
        // Accessories
        { name: "Ergonomic Laptop Stand", price: 1500, img: "images/accessories.jpg", category: "accessories", type: "buy" },
        { name: "High-Precision Wireless Mouse", price: 800, img: "images/accessories1.jpg", category: "accessories", type: "buy" },
        { name: "Smart LED Desk Lamp", price: 1200, img: "images/accessories.jpg", category: "accessories", type: "buy" },
        { name: "Professional Scientific Calculator", price: 1100, img: "images/accessories1.jpg", category: "accessories", type: "buy" },
        { name: "Stainless Steel Water Bottle", price: 400, img: "images/accessories.jpg", category: "accessories", type: "buy" },
        { name: "Noise Cancelling Bluetooth Speaker", price: 1500, img: "images/accessories1.jpg", category: "accessories", type: "buy" },
        { name: "Digital Multimeter Tool", price: 1200, img: "images/accessories.jpg", category: "accessories", type: "buy" },
        { name: "High-Definition DSLR (Rent)", price: 1000, img: "images/accessories1.jpg", category: "accessories", type: "rent" }
    ];

    products.forEach(p => {
        db.get("SELECT * FROM products WHERE name = ?", [p.name], (err, row) => {
            if (!row) {
                db.run("INSERT INTO products (name, price, img, category, type) VALUES (?, ?, ?, ?, ?)", [p.name, p.price, p.img, p.category, p.type]);
            }
        });
    });
    console.log("Product seeding checked.");
});

module.exports = db;
