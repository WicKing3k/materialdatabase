// app.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Datenbankverbindung
const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'materials_db',
    password: 'your_password',
    port: 5432,
});

// Authentifizierung Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        // Hier würde normalerweise die Passwort-Überprüfung stattfinden
        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Material/Produkt erstellen
app.post('/api/items', authenticateToken, async (req, res) => {
    try {
        const {
            type,
            name,
            dimensions,
            manufacturer,
            lambda_value,
            mu_dry,
            mu_wet,
            sd_value,
            vkf_class,
            load_value,
            ubp_id,
            unit,
            price
        } = req.body;

        // ID generieren (Mxxx oder Pxxx)
        const prefix = type === 'M' ? 'M' : 'P';
        const result = await pool.query(
            'SELECT id FROM materials_products WHERE type = $1 ORDER BY id DESC LIMIT 1',
            [type]
        );
        
        let newId;
        if (result.rows.length === 0) {
            newId = `${prefix}001`;
        } else {
            const lastId = result.rows[0].id;
            const lastNum = parseInt(lastId.substring(1));
            newId = `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
        }

        const insertResult = await pool.query(
            `INSERT INTO materials_products (
                id, type, name, dimensions, manufacturer, lambda_value,
                mu_dry, mu_wet, sd_value, vkf_class, load_value,
                ubp_id, unit, price, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *`,
            [newId, type, name, dimensions, manufacturer, lambda_value,
             mu_dry, mu_wet, sd_value, vkf_class, load_value,
             ubp_id, unit, price, req.user.id]
        );

        res.json(insertResult.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Weitere Routes hier...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));