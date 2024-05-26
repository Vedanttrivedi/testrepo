
const express = require('express');
const router = express.Router();
const {
  addProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getSellerProperties,
  filterProperties,
  sendContactDetails,
} = require('../controllers/propertyController');
const upload = require('../middleware/upload');
const authenticate = require('../middleware/authenticate');




router.post('/properties', authenticate, upload.single('photo'), addProperty);
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);
router.put('/properties/:id', authenticate, upload.single('photo'), updateProperty);
router.delete('/properties/:id', authenticate, deleteProperty);
router.get('/seller/:ownerId', authenticate, getSellerProperties);
router.get('/filter', filterProperties);
router.post('/properties/:userId', authenticate, sendContactDetails);



module.exports = router;
