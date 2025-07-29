import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Star, CheckCircle, Users, Smile, ThumbsUp } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// -------------------- Constants & Animations --------------------
export const testimonialStats = [
  { label: 'Happy Clients', value: '1K+', icon: Smile, color: 'from-green-400 to-green-600' },
  { label: 'Average Rating', value: '3.9', icon: Star, color: 'from-yellow-400 to-yellow-600' },
  { label: 'Client Trust', value: '99.8%', icon: ThumbsUp, color: 'from-blue-400 to-blue-600' },
  { label: 'Success Rate', value: '4.9', icon: Users, color: 'from-purple-400 to-purple-600' },
];

export const headerVariantsfeature = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const floatingAnimationfeature = {
  y: [0, -4, 0],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
};

export const pulseAnimationfeature = {
  scale: [1, 1.1, 1],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

// -------------------- Image Upload --------------------
const uploadTestimonialImage = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from('am-images').upload(`testimonials/${fileName}`, file);
  if (error) throw error;
  const { data: publicUrlData } = supabase.storage.from('am-images').getPublicUrl(`testimonials/${fileName}`);
  return publicUrlData.publicUrl;
};

// -------------------- Main Component --------------------
const Testimonials = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    feedback: '',
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await uploadTestimonialImage(formData.image);
      await axios.post('/Api/testimonials/add', {
        ...formData,
        imageUrl,
        rating: Number(formData.rating),
      });
      setSuccess(true);
      // Reset form data
      setFormData({ name: '', location: '', rating: 5, feedback: '', image: null });
      e.target.reset(); // Also clear file input
      fetchTestimonials();
    } catch (err) {
      alert('Error submitting testimonial');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get('/Api/testimonials/all');
      setTestimonials(res.data);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <div className="py-10 sm:px-6 lg:px-10 transition-colors duration-500">
      {/* Header */}
      <section className="text-center mb-12">
        <motion.div
          variants={headerVariantsfeature}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-8">
          <motion.div
            animate={floatingAnimationfeature}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-lg border border-blue-200/50 dark:border-blue-500/30">
            <Sparkles className="w-4 h-4" />
            Client Testimonials
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight">
          What Our Clients Are{' '}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Saying
          </span>
        </h2>

        <motion.div
          className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full shadow-lg mx-auto"
          animate={pulseAnimationfeature}
        />

        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-4 text-sm sm:text-base">
          Discover why thousands trust AMEstate to find their perfect property.
        </p>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mt-10">
          {testimonialStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.04 }}
              className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center shadow-xl border border-white/50 dark:border-slate-700 hover:shadow-2xl transition-all duration-300">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto mb-20 bg-white dark:bg-slate-800 shadow-2xl px-4 sm:px-6 py-8 sm:py-10 rounded-3xl border border-gray-200 dark:border-slate-700 transition-all">
        <h2 className="text-lg sm:text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Share Your Experience
        </h2>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            onChange={handleChange}
            className="col-span-1 px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-slate-600 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="location"
            placeholder="Your Location"
            required
            onChange={handleChange}
            className="col-span-1 px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-slate-600 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="rating"
            onChange={handleChange}
            defaultValue={5}
            className="col-span-1 px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} Star</option>
            ))}
          </select>
          <textarea
            name="feedback"
            placeholder="Your Feedback"
            required
            rows={2}
            onChange={handleChange}
            className="col-span-full lg:col-span-2 px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-slate-600 placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <div className="col-span-full">
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-white mb-2">
              Upload Your Photo
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              onChange={handleChange}
              className="
                w-full
                px-3 sm:px-4 py-2
                text-xs sm:text-sm
                dark:text-white
                border border-gray-300 dark:border-slate-600
                rounded-xl
                file:py-2 file:px-4
                file:rounded-md
                file:border-0
                file:text-xs sm:file:text-sm
                file:font-semibold
                file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white
                hover:file:brightness-110
                transition
              "
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold 
          hover:-translate-y-1 hover:shadow-xl transform transition-all duration-300 shadow-lg">
          {loading ? 'Submitting...' : 'Submit Testimonial'}
        </button>


        {success && (
          <div className="mt-6 text-center text-green-600 dark:text-green-400 font-medium flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2">
            <CheckCircle size={16} className="min-w-[16px]" />
            <span>Testimonial submitted successfully!</span>
          </div>
        )}
      </form>

      {/* Testimonials Display */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-2 md:px-0 max-w-6xl mx-auto">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No testimonials available yet.
          </div>
        ) : (
          testimonials.map((t, i) => (
            <div
              key={i}
              className="animate-fadeInUp h-full"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Equal height card using flex-col + justify-between */}
              <div className="hover:-translate-y-3 hover:scale-1.05 h-full flex flex-col justify-between bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 
                hover:shadow-xl transition border border-gray-100 dark:border-slate-700">
                {/* Verified badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <CheckCircle size={14} className="mr-1" />
                    Verified
                  </span>
                </div>

                {/* Feedback section */}
                <p className="text-gray-700 dark:text-gray-300 text-sm italic mb-6 leading-relaxed flex-1">
                  “{t.feedback}”
                </p>

                {/* Footer: avatar + name + stars */}
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.location}</p>
                    <div className="flex items-center mt-1 text-yellow-500">
                      {[...Array(t.rating)].map((_, r) => (
                        <Star key={r} size={14} fill="#facc15" stroke="none" />
                      ))}
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">{t.rating}.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* CTA */}
      <section className="text-center mt-16">
        <Link to="contact2" className="block w-full sm:w-auto mx-auto">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 
              text-white rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all font-semibold text-base sm:text-lg 
              inline-flex items-center justify-center group relative overflow-hidden">
            <span className="relative z-10 text-center">Share Your Experience</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Join thousands of satisfied clients in our growing community
        </p>
      </section>
    </div>
  );
};

export default Testimonials;
