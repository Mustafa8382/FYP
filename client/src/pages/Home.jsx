// --------------------------- Imports ---------------------------

// Icons from lucide-react for UI
import { Star, Users, HomeIcon, Shield, Sparkles, TrendingUp, Award, ArrowRight, ChevronRight} from "lucide-react";

// Logos object for company logos
import { logos } from '../assets/logo';

// Animation library
import { motion } from "framer-motion";

// Icons for filters
import { Search, Car, Sofa, Tag, ArrowDownUp } from 'lucide-react';

// React Router navigation
import { useNavigate, Link } from 'react-router-dom';

// Layout components
import Footer from '../components/Footer.jsx';
import Testimonials from '../components/Testimonials';
import ListingItem from '../components/ListingItem';

import heroimage from "../assets/heroimage.png";

// Text gradient for hero title
import { RadialGradient } from "react-text-gradients";

// Hooks
import { useEffect, useState } from 'react';

// Swiper carousel
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';

// Feature data
import { features } from "../assets/featuredata";

// --------------------------- Static Data ---------------------------

// Stats used in the hero section
const heroStats = [
  { icon: Users, value: "50K+", label: "Happy Customers", color: "from-blue-500 to-cyan-500" },
  { icon: HomeIcon, value: "25K+", label: "Properties Listed", color: "from-green-500 to-emerald-500" },
  { icon: Star, value: "4.9", label: "Average Rating", color: "from-yellow-500 to-orange-500" },
  { icon: Shield, value: "100%", label: "Verified Properties", color: "from-purple-500 to-pink-500" }
];

// Stats used in the company trust section
const stats = [
  { icon: Users, value: "200+", label: "Trusted Partners" },
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: Award, value: "50M+", label: "Properties Listed" },
  { icon: TrendingUp, value: "98%", label: "Success Rate" }
];

// Companies logos used in the grid section
const companyLogos = [
  { src: logos.Googlelogo, alt: "Google", name: "Google" },
  { src: logos.Bookinglogo, alt: "Booking.com", name: "Booking.com" },
  { src: logos.Airbnblogo, alt: "Airbnb", name: "Airbnb" },
  { src: logos.Microsoftlogo, alt: "Microsoft", name: "Microsoft" },
  { src: logos.Amazonlogo, alt: "Amazon", name: "Amazon" }
];

// --------------------------- Animation Variants ---------------------------

// Fade and stagger children animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

// Element entrance animation
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6
    }
  }
};

// Repeated floating background animations
const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Logo animation variant
const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 25
    }
  }
};

// Feature section animations
const containerVariantsfeature = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};
const cardVariantsfeature = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  },
};
const headerVariantsfeature = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};
const pulseAnimationfeature = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};
const floatingAnimationfeature = {
  y: [-3, 3, -3],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// --------------------------- Home Component Start ---------------------------
export default function Home() 
{

  const navigate = useNavigate();
  // State to manage search/filter values
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  // Input change handler
  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === 'searchTerm') {
      setSidebardata((prev) => ({ ...prev, searchTerm: value }));
    }

    if (['all', 'rent', 'sale'].includes(id)) {
      setSidebardata((prev) => ({ ...prev, type: id }));
    }

    if (['parking', 'furnished', 'offer'].includes(id)) {
      setSidebardata((prev) => ({ ...prev, [id]: checked }));
    }

    if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata((prev) => ({ ...prev, sort, order }));
    }
  };

  // On search submit, redirect with query parameters
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    navigate(`/properties?${urlParams.toString()}`);
  };

  const [hoveredCard, setHoveredCard] = useState(null);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  
  // Enable Swiper navigation
  SwiperCore.use([Navigation]);
  console.log(offerListings);

  // useEffect to fetch listings data
  // Fetching offer, rent, and sale listings in sequence
  // This will ensure that the offer listings are fetched first, then rent, and finally sale listings.
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/Api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/Api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/Api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);

  // --------------------------- JSX Return ---------------------------
  return (
    <div>
      {/* Hero Section Start Here */}
      <section className="relative min-h-screen overflow-hidden">
        
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0">
          {/* Base gradient background for light and dark */}
          <div className="absolute inset-0 bg-gradient-to-br 
            from-slate-50 via-blue-50/30 to-indigo-50 
            dark:from-gray-950 dark:via-gray-900 dark:to-black">
          </div>

          {/* Hero image with overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroimage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Light/Dark gradient overlays */}
            <div className="absolute inset-0 
              bg-gradient-to-t from-white/20 via-transparent to-white/10 
              dark:from-black/70 dark:via-transparent dark:to-black/20" />
            <div className="absolute inset-0 
              bg-gradient-to-r from-blue-200/20 via-transparent to-purple-200/20 
              dark:from-blue-900/30 dark:via-transparent dark:to-purple-900/30" />
          </motion.div>

          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0], transition: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute top-20 left-10 w-64 h-64 
                bg-gradient-to-br from-blue-400/20 to-cyan-400/20 
                dark:from-blue-800/20 dark:to-cyan-800/20 
                rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10], transition: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute top-40 right-20 w-96 h-96 
                bg-gradient-to-br from-purple-400/15 to-pink-400/15 
                dark:from-purple-900/20 dark:to-pink-900/20 
                rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [-15, 15, -15], x: [-10, 10, -10], transition: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute bottom-20 left-1/3 w-80 h-80 
                bg-gradient-to-br from-green-400/10 to-emerald-400/10 
                dark:from-green-900/10 dark:to-emerald-900/10 
                rounded-full blur-3xl"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Top spacing */}
          <div className="pt-24 lg:pt-20"></div>
          
          {/* Hero Content */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center">

                {/* Trust Badge */}
                <motion.div 
                  variants={itemVariants}
                  className="inline-flex flex-wrap items-center gap-2 
                            px-4 sm:px-6 py-2 sm:py-3 
                            bg-white/90 dark:bg-gray-800/80 backdrop-blur-md 
                            text-blue-700 dark:text-blue-300 
                            rounded-full text-xs sm:text-sm font-semibold 
                            mb-6 sm:mb-8 shadow-lg border 
                            border-blue-100 dark:border-blue-300/20">
                  <Shield className="w-3 sm:w-4 h-3 sm:h-4" />

                  <span className="whitespace-nowrap">Trusted by 1,000+ families</span>
                  
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Main Heading */}
                <motion.div variants={itemVariants} className="mb-20">
                  <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 leading-[0.9]">
                    <RadialGradient
                      gradient={["circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%"]}>
                      Find Your Perfect
                    </RadialGradient>
                    <br />
                    <span className="text-gray-900 bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                      Dream Home
                    </span>
                  </h1>

                  <motion.p 
                    variants={itemVariants}
                    className="text-gray-700 text-xl sm:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                    Discover exceptional properties in prime locations with our 
                    <span className="text-blue-600 font-semibold"> expert guidance</span> and 
                    <span className="text-purple-600 font-semibold"> personalized service.</span>
                  </motion.p>
                </motion.div>
                
                {/* Search Box Data */}
                <div className="flex justify-center mt-12">
                  <div className="w-full max-w-5xl bg-white/80 dark:bg-[#1f2937]/70 border border-gray-200 dark:border-gray-700 backdrop-blur-lg p-6 sm:p-8 rounded-3xl 
                    shadow-2xl dark:shadow-[0_4px_60px_rgba(0,0,0,0.6)] transition-all duration-500">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Search Bar */}
                      <div className="w-full">
                        <div className="relative w-full">
                          <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search location or keyword"
                            aria-label="Search"
                            className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-5 py-3 pr-12 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                          />
                          <button
                            type="submit"
                            className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 transition"
                          >
                            <Search className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Types / Amenities / Sort */}
                      <div className="w-full flex flex-col gap-4 items-center md:flex-row md:flex-wrap md:justify-between xl:justify-around">
                        {/* Types */}
                        <div className="flex-1 flex flex-wrap gap-2 justify-center md:justify-center md:order-1 mb-2 md:mb-0">
                          {['all', 'rent', 'sale'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              id={type}
                              onClick={handleChange}
                              className={`px-4 py-2 rounded-full text-xs font-semibold border shadow-sm transition-all duration-300 flex items-center gap-1 ${
                                sidebardata.type === type
                                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white border-blue-600 shadow-lg'
                                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-sm'
                              }`}
                            >
                              {type.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        {/* Amenities */}
                        <div className="flex-1 flex flex-wrap gap-2 justify-center md:justify-start md:order-2 mt-0">
                          {[
                            { id: 'parking', icon: <Car className="w-4 h-4" />, label: 'Parking' },
                            { id: 'furnished', icon: <Sofa className="w-4 h-4" />, label: 'Furnished' },
                            { id: 'offer', icon: <Tag className="w-4 h-4" />, label: 'Offer' },
                          ].map(({ id, icon, label }) => (
                            <label key={id}>
                              <input type="checkbox" id={id} onChange={handleChange} checked={sidebardata[id]} className="hidden" />
                              <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold border shadow-sm cursor-pointer transition-all duration-300 ${
                                sidebardata[id]
                                  ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white border-purple-600 shadow-md'
                                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-700 hover:shadow-sm'
                              }`}>
                                {icon}
                                {label}
                              </span>
                            </label>
                          ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex-1 w-full md:w-[260px] flex items-center justify-center md:justify-center xl:justify-end relative md:order-3 pt-2 md:pt-0">
                          <div className="relative w-full">
                            <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-300 pointer-events-none" />
                            <select
                              id="sort_order"
                              onChange={handleChange}
                              defaultValue="created_at_desc"
                              className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-400 shadow-inner bg-white dark:bg-gray-800 text-black dark:text-white appearance-none transition-all"
                            >
                              <option value="regularPrice_desc">Price: High → Low</option>
                              <option value="regularPrice_asc">Price: Low → High</option>
                              <option value="createdAt_desc">Newest First</option>
                              <option value="createdAt_asc">Oldest First</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-center px-3 w-full">
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                        >
                          <Search className="w-4 h-4" />
                          Search Properties
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Stats Section */}
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-10">
                  {heroStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.05 }}
                      className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl 
                        border border-white/50 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                      <div
                        className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.color} 
                          rounded-2xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

              </motion.div>
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="pb-16"></div>
        </div>

      </section>
      
      {/* Companies Section Start Here */}
      <section className="py-28 relative overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-black" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 dark:from-blue-800/20 dark:to-indigo-800/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700
                dark:text-blue-300 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Trusted Worldwide
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful companies that rely on our platform for their real estate needs
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100
                  dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <motion.div
                  animate={floatingAnimation}
                  className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Companies Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-2xl">
            
            {/* Logos Above Text */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Powering Success for Global Brands
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                From startups to Fortune 500 companies, we're the trusted choice
              </p>
            </motion.div>

            {/* Logos */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 items-center px-2 sm:px-4">
              {companyLogos.map((logo, index) => (
                <motion.div
                  key={index}
                  variants={logoVariants}
                  whileHover={{
                    scale: 1.1,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  className="group relative">
                  <div className="relative overflow-hidden rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 sm:p-4 md:p-5 border border-gray-100 dark:border-gray-700 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      className="mx-auto object-contain h-auto max-h-12 sm:max-h-14 md:max-h-16 w-full max-w-[120px] sm:max-w-[140px] md:max-w-[160px] filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      src={logo.src}
                      alt={logo.alt}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                      {logo.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">GDPR Compliant</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16">
            <a
              href="https://chat.whatsapp.com/JR0gt3phAX1Frarw4YwNjv?mode=ac_t"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full sm:w-auto text-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-4 
                  bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 
                  text-white rounded-2xl shadow-2xl hover:shadow-blue-500/25 
                  transition-all font-bold text-base sm:text-lg 
                  inline-flex justify-center items-center group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Join Our Network
                  <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </a>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
              Start your journey with industry-leading companies today
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section Start Here */}
      <section className="py-28 relative overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 dark:from-blue-800/20 dark:to-indigo-800/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 dark:from-cyan-800/10 dark:to-blue-800/10 rounded-full blur-3xl"></div>
        </div>

        {/* Enhanced Section Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={headerVariantsfeature}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div 
              animate={floatingAnimationfeature}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 
                        bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 
                        text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm md:text-base 
                        font-semibold tracking-wide mb-6 shadow-lg border border-blue-200/50 
                        dark:border-blue-900/50 max-w-full text-center mx-auto">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">OUR PREMIUM FEATURES</span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 
                          dark:from-white dark:via-blue-200 dark:to-indigo-200 
                          bg-clip-text text-transparent mb-6 leading-tight">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>

            <div className="flex justify-center mb-8">
              <motion.div 
                className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full shadow-lg"
                animate={pulseAnimationfeature}
              ></motion.div>
            </div>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Experience unparalleled service with our innovative approach to finding your{" "}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">perfect home</span>
            </p>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-gray-500 dark:text-gray-300"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Award Winning Service</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="font-medium">98% Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Trusted by 1K+ Families</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariantsfeature}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={cardVariantsfeature}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{
                  y: -15,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/50 dark:border-gray-700 transition-all duration-500 h-full">
                  <motion.div
                    className="relative w-20 h-20 mb-8"
                    animate={hoveredCard === index ? { rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-30"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:border-blue-300 transition-all duration-300">
                      <feature.icon className="h-10 w-10 text-blue-600 dark:text-blue-400 group-hover:text-indigo-600 transition-colors duration-300" />
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center mt-20"
          >
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-12 border border-gray-200/50 dark:border-gray-700 shadow-2xl">
              <motion.div
                animate={floatingAnimationfeature}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Find Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dream Home?
                </span>
              </h3>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their perfect home with our premium features and personalized service.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                {/* Browse Button */}
                <Link to="/properties">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all text-base sm:text-lg inline-flex items-center group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Browse Properties
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </Link>

                {/* Contact Button */}
                <Link to="/contact2">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-bold rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-all text-base sm:text-lg inline-flex items-center group"
                  >
                    Contact Expert
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </Link>
              </div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">10,000+ Happy Families</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">5-Star Average Rating</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">24/7 Premium Support</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Listing Start Here */}
      <section className='py-28 px-6 relative overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 
        flex flex-col gap-8'>
        <div className="max-w-6xl mx-auto">

          {/* Properties Text */}
          <div className="text-center mb-16">
            <motion.div
              variants={headerVariantsfeature}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-8">
              <motion.div 
                animate={floatingAnimationfeature}
                className="inline-flex items-center gap-2 px-6 py-3 
                  bg-gradient-to-r from-blue-100 to-indigo-100 
                  dark:from-blue-900/30 dark:to-indigo-900/30 
                  text-blue-700 dark:text-blue-300 
                  rounded-full text-sm font-semibold tracking-wide 
                  shadow-lg border border-blue-200/50 dark:border-blue-800/40">
                <Sparkles className="w-4 h-4" />
                  Explore Properties
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </motion.div>  

            <h2 className="text-5xl md:text-6xl font-bold 
                bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 
                dark:from-white dark:via-blue-200 dark:to-indigo-200 
                bg-clip-text text-transparent mb-6 leading-tight">
              Featured{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Properties
              </span>
            </h2>

            <div className="flex justify-center mb-8">
              <motion.div 
                className="w-32 h-1.5 
                          bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 
                          rounded-full shadow-lg"
                animate={pulseAnimationfeature}
              ></motion.div>
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties designed to match your lifestyle needs
            </p>
          </div>

          {/* Offer Listings */}
          {offerListings && offerListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-200'>Recent offers</h2>
                <Link className='text-sm text-blue-800 dark:text-blue-400 hover:underline' to={'/properties?offer=true'}>
                  Show more offers
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {/* Rent Listings */}
          {rentListings && rentListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-200'>Recent places for rent</h2>
                <Link className='text-sm text-blue-800 dark:text-blue-400 hover:underline' to={'/properties?type=rent'}>
                  Show more places for rent
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {/* Sale Listings */}
          {saleListings && saleListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-200'>Recent places for sale</h2>
                <Link className='text-sm text-blue-800 dark:text-blue-400 hover:underline' to={'/properties?type=sale'}>
                  Show more places for sale
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Testimonial Section Start */}
      <section className="py-28 px-6 relative overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Testimonials />
      </section>

      {/* Footer Section Start Here */}
      <Footer/>
    </div>
  );
};
