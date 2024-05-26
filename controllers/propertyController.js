const Property = require('../models/Property');

const path = require('path');
const nodeMailer = require('nodemailer');

const addProperty = async (req, res) => {
  try {
    const { location, area, bedrooms, bathrooms, nearbyHospital, nearbyCollege, rent, maintenance, noOfTenantsAllowed, userId } = req.body;

    const ownerId = userId;

    console.log("ownerId : "+ownerId);

    // Extract just the filename from the file path
    const photoFileName = path.basename(req.file.path);

    const newProperty = new Property({
      ownerId,
      photo: photoFileName, 
      location,
      area,
      bedrooms,
      bathrooms,
      nearbyHospital,
      nearbyCollege,
      rent,
      maintenance,
      noOfTenantsAllowed,
    });
    console.log(newProperty);
    await newProperty.save();
    res.status(201).json({ message: 'Property added successfully', property: newProperty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { location, area, bedrooms, bathrooms, nearbyHospital, nearbyCollege, rent, maintenance, noOfTenantsAllowed } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (location) property.location = location;
    if (area) property.area = area;
    if (bedrooms) property.bedrooms = bedrooms;
    if (bathrooms) property.bathrooms = bathrooms;
    if (nearbyHospital) property.nearbyHospital = nearbyHospital;
    if (nearbyCollege) property.nearbyCollege = nearbyCollege;
    if (rent) property.rent = rent;
    if (maintenance) property.maintenance = maintenance;
    if (noOfTenantsAllowed) property.noOfTenantsAllowed = noOfTenantsAllowed;
    if (req.file) property.photo = req.file.path;

    await property.save();
    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getPropertyByOwnerId = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    console.log(ownerId + " property owner");

    const properties = await Property.find({ ownerId })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments({ ownerId });

    if (!properties) {
      return res.status(404).json({ message: 'Properties not found' });
    }

    res.status(200).json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const filterProperties = async (req, res) => {
  try {
    const {
      location,
      area,
      bedrooms,
      bathrooms,
      nearbyHospital,
      nearbyCollege,
      rentMin,
      rentMax,
      maintenanceMin,
      maintenanceMax,
    } = req.query;

    let query = {};

    if (location) query.location = { $regex: new RegExp(location, 'i') };
    if (area) query.area = { $regex: new RegExp(area, 'i') };
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (bathrooms) query.bathrooms = parseInt(bathrooms);
    if (nearbyHospital) query.nearbyHospital = { $lte: parseInt(nearbyHospital) };
    if (nearbyCollege) query.nearbyCollege = { $lte: parseInt(nearbyCollege) };
    if (rentMin || rentMax) {
      query.rent = {};
      if (rentMin) query.rent.$gte = parseInt(rentMin);
      if (rentMax) query.rent.$lte = parseInt(rentMax);
    }
    if (maintenanceMin || maintenanceMax) {
      query.maintenance = {};
      if (maintenanceMin) query.maintenance.$gte = parseInt(maintenanceMin);
      if (maintenanceMax) query.maintenance.$lte = parseInt(maintenanceMax);
    }

    console.log('Filter query:', query); // Log the query object for debugging

    const filteredProperties = await Property.find(query);
    res.status(200).json(filteredProperties);
  } catch (error) {
    console.error('Error filtering properties:', error.message); // Log the error message
    console.error(error.stack); // Log the error stack for more details
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


sendContactDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone } = req.body;

    try {
      const transporter = nodeMailer.createTransport({
          service: 'gmail',
          auth: {
              user: "bhaibhaihudhuddabang@gmail.com",
              pass: "foglrszqefspwtjc",
          }
      });

      const mailOptions = {
          from: "bhaibhaihudhuddabang@gmail.com",
          to: userId,
          subject: `Details of Owner: ${name}`,
          html: `
              <h1>Owner Details</h1>
              <p>Name : </strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Mobile:</strong> ${phone}</p>
              <p>Thanks for using rentify</p>
          `
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              res.status(500).send('Error occurred while sending email');
          } else {
              // console.log('Email sent: ' + info.response);
              res.status(200).send('Email sent successfully');
          }
      });
  } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
  }
}catch (err) {
  console.log(err);
  res.status(500).send('Internal server error');
}
};



module.exports = {
  addProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getSellerProperties: getPropertyByOwnerId,
  filterProperties,
  sendContactDetails
};



