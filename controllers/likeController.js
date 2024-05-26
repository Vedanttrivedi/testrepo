const Like = require('../models/Like');
const Property = require('../models/Property');

// Get like count by property ID
exports.getLikeCountByPropertyID = async (req, res) => {
  try {
    const likeCount = await Like.countDocuments({ propertyId: req.params.propertyId });
    res.json({ likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add like
exports.addLike = async (req, res) => {
  try {
    const { propertyId,userId } = req.body;
    const newLike = new Like({ propertyId, userId });
    await newLike.save();
    res.json({ message: 'Like added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete like
exports.deleteLike = async (req, res) => {
    try {
      const { propertyId, userId } = req.params;
      await Like.findOneAndDelete({ propertyId, userId});
      res.json({ message: 'Like deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  


exports.isPropertyLikedByUser = async (req, res) => {
    try {
      const { propertyId, userId } = req.params;
  
      // Query the database to check if the property is liked by the user
      const like = await Like.findOne({ propertyId, userId });
  
      // If like exists, it means the property is liked by the user, otherwise not
      const isLiked = like ? true : false;
      console.log("Property is liked "+isLiked);
  
      res.json({ isLiked });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };