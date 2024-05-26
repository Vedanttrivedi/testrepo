const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likeController');
const authenticate = require('../middleware/authenticate');

router.get('/likeCount/:propertyId', likesController.getLikeCountByPropertyID);

router.post('/addLike', authenticate, likesController.addLike);

router.delete('/deleteLike/:propertyId/:userId', authenticate, likesController.deleteLike);


router.get('/isLiked/:propertyId/:userId', likesController.isPropertyLikedByUser);

module.exports = router;
