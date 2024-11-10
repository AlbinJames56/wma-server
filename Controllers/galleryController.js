const Gallery = require("../Models/gallerySchema"); // Import the Gallery model

// add image to gallery
exports.addImage = async (req, res) => {
  try {
    const { imageURL } = req.body;
    if (!imageURL) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const newImage = new Gallery({ imageURL });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Failed to save image" });
  }
};

// Get all gallery images
exports.getImages = async (req, res) => {
    console.log("inside get gallery");
    
    try {
      const images = await Gallery.find();
      res.status(200).json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  };
  
  // Delete an image by ID
  exports.deleteImage = async (req, res) => {
    try {
      const { id } = req.params;
      await Gallery.findByIdAndDelete(id);
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  };