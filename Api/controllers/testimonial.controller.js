import Testimonial from '../models/testimonial.model.js';

export const addTestimonial = async (req, res) => {
  try {
    const { name, location, rating, feedback, imageUrl } = req.body;

    if (!name || !location || !rating || !feedback || !imageUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const testimonial = new Testimonial({ name, location, rating, feedback, imageUrl });
    await testimonial.save();

    res.status(201).json({ message: 'Testimonial added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials', error: err.message });
  }
};
