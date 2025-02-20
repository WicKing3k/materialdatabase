const express = require('express');
const router = express.Router();
const {
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial
} = require('../controllers/materialController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, getAllMaterials);
router.get('/:id', authenticateToken, getMaterialById);
router.post('/', authenticateToken, createMaterial);
router.put('/:id', authenticateToken, updateMaterial);
router.delete('/:id', [authenticateToken, isAdmin], deleteMaterial);

module.exports = router;