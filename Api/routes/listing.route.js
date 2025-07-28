import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

// ✅ NEW ROUTE: Search by custom listingId like LST123456
router.get('/search/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const Listing = (await import('../models/listing.model.js')).default;

    const listing = await Listing.findOne({ listingId });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Search by listingId failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
