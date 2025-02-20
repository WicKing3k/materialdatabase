const db = require('../models/database');

const getAllMaterials = async (req, res) => {
    try {
        const { search, type, manufacturer } = req.query;
        let query = 'SELECT * FROM materials_products WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (name ILIKE $' + (params.length + 1) + ' OR manufacturer ILIKE $' + (params.length + 1) + ')';
            params.push(`%${search}%`);
        }

        if (type) {
            query += ' AND type = $' + (params.length + 1);
            params.push(type);
        }

        if (manufacturer) {
            query += ' AND manufacturer ILIKE $' + (params.length + 1);
            params.push(`%${manufacturer}%`);
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT * FROM materials_products WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Material not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createMaterial = async (req, res) => {
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

        // Generate ID
        const prefix = type === 'M' ? 'M' : 'P';
        const result = await db.query(
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

        const insertResult = await db.query(
            `INSERT INTO materials_products (
                id, type, name, dimensions, manufacturer,
                lambda_value, mu_dry, mu_wet, sd_value,
                vkf_class, load_value, ubp_id, unit,
                price, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *`,
            [
                newId, type, name, dimensions, manufacturer,
                lambda_value, mu_dry, mu_wet, sd_value,
                vkf_class, load_value, ubp_id, unit,
                price, req.user.id
            ]
        );

        res.status(201).json(insertResult.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const {
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

        const result = await db.query(
            `UPDATE materials_products SET
                name = $1,
                dimensions = $2,
                manufacturer = $3,
                lambda_value = $4,
                mu_dry = $5,
                mu_wet = $6,
                sd_value = $7,
                vkf_class = $8,
                load_value = $9,
                ubp_id = $10,
                unit = $11,
                price = $12,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $13
            RETURNING *`,
            [
                name, dimensions, manufacturer,
                lambda_value, mu_dry, mu_wet,
                sd_value, vkf_class, load_value,
                ubp_id, unit, price, id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Material not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM materials_products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Material not found' });
        }

        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial
};