import express from 'express';
import { addTestimonial, getTestimonials } from '../controllers/testimonial.controller.js';

const router = express.Router();

router.post('/add', addTestimonial);
router.get('/all', getTestimonials);

export default router;
