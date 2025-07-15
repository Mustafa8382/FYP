import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";
import { Target, Eye, Shield, CheckCircle, Clock, Home, Globe, Headphones, List } from 'lucide-react';
import mustafaImage from '../assets/about1.jpg';
import adeelImage from '../assets/about2.jpg';
import Footer from '../components/Footer.jsx';

export default function About() {
  const milestones = [
    { label: 'Projects Completed', count: 120 },
    { label: 'Happy Clients', count: 85 },
    { label: 'Years of Experience', count: 5 },
    { label: 'Awards Won', count: 12 },
  ];
  const [counters, setCounters] = useState(milestones.map(() => 0));
  
  useEffect(() => {
    milestones.forEach((m, idx) => {
      let current = 0;
      const step = Math.ceil(m.count / 100);
      const interval = setInterval(() => {
        current += step;
        if (current >= m.count) {
          current = m.count;
          clearInterval(interval);
        }
        setCounters(prev => {
          const copy = [...prev];
          copy[idx] = current;
          return copy;
        });
      }, 20);
    });
  }, []);

  const [openFAQ, setOpenFAQ] = useState(null);
  const faqs = [
    {
      q: 'What types of projects do you handle?',
      a: 'Residential buildings, smart homes, commercial plazas, and eco-friendly communities.',
    },
    {
      q: 'Do you offer design consultation?',
      a: 'Yes! We provide design consultation, 3D modeling, and planning services before construction begins.',
    },
    {
      q: 'Where are your projects located?',
      a: 'Our developments are in major cities including Lahore, Kasur, Karachi, Islamabad, and Multan.',
    },
  ];

  return (
    <div className='bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300'>
      {/* 1 Hero Section */}
      <section className="relative h-[91vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"
            animate={{
              background: [
                'linear-gradient(to bottom right, rgba(37, 99, 235, 1), rgba(79, 70, 229, 1), rgba(124, 58, 237, 0.8))',
                'linear-gradient(to bottom right, rgba(79, 70, 229, 1), rgba(124, 58, 237, 0.8), rgba(37, 99, 235, 1))',
                'linear-gradient(to bottom right, rgba(124, 58, 237, 0.8), rgba(37, 99, 235, 1), rgba(79, 70, 229, 1))'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Animated shapes */}
          <div className="absolute inset-0 opacity-20">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-300"
              animate={{ 
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0],
                scale: [1, 1.1, 1, 0.9, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-300"
              animate={{ 
                x: [0, -40, 0, 40, 0],
                y: [0, 40, 0, -40, 0],
                scale: [1, 0.9, 1, 1.1, 1]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div 
              className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-purple-300"
              animate={{ 
                x: [0, 50, 0, -50, 0],
                y: [0, -50, 0, 50, 0],
                scale: [1, 1.2, 1, 0.8, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjMiPjxwYXRoIGQ9Ik01IDEwQzMuODk1IDEwIDMgMTAuODk1IDMgMTJ2MzhjMCAxLjEwNS44OTUgMiAyIDJoMzhWMTBINXptMzgtMkg1QzIuODEgOCAxIDkuODEgMSAxMnYzOGMwIDIuMTkgMS43OSA0IDQgNGg0MWMxLjEwNSAwIDItLjg5NSAyLTJWMTBjMC0xLjEwNS0uODk1LTItMi0yaC0zeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
        </div>

        {/* Content Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative text-center text-white px-4 max-w-4xl mx-auto z-10"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight text-white dark:text-white">
            Building Your Future,<br />One Home at a Time
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90 dark:text-gray-300">
            We're more than just a property platform — we're your partner in finding the perfect place to call home.
          </p>

          
          {/* Decorative line */}
          <motion.div 
            className="w-24 h-1 bg-white mx-auto mt-8"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.div>
      </section>

      {/* 2 Our Purpose Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Our Purpose</h2>
            <div className="w-24 h-1 bg-blue-600 dark:bg-blue-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Our Mission */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                To provide a transparent and efficient property rental experience for all users. 
                We strive to make the process of finding your perfect home as seamless as possible, 
                while maintaining the highest standards of service and integrity.
              </p>
            </div>

            {/* Our Vision */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Empowering millions of users to find their perfect home with ease and trust. 
                We envision a future where property search is not just about finding a place to live, 
                but about discovering a community to belong to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Our Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Our Values</h2>
            <div className="w-24 h-1 bg-blue-600 dark:bg-blue-400 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              These core values guide everything we do at AMEstate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Trust Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:rotate-6'>
                    <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">Trust</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We verify all property owners and renters to ensure a safe and reliable experience for everyone.
              </p>
            </div>

            {/* Transparency Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:rotate-6'>
                    <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">Transparency</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Clear and honest property listings with accurate information and no hidden fees.
              </p>
            </div>

            {/* Efficiency Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:rotate-6'>
                    <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">Efficiency</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Streamlined property search and listing process to save you time and effort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Our Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Meet Our Team</h2>
            <div className="w-24 h-1 bg-blue-600 dark:bg-blue-400 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              The passionate individuals behind AMEstate's success
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 grid gap-10 grid-cols-1 md:grid-cols-2">
          {/* Team Member 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <img
              src={mustafaImage}
              alt="Ata Ul Mustafa"
              className="w-32 h-32 rounded-full mx-auto object-cover"
            />
            <h2 className="text-xl font-bold mt-4 text-gray-800 dark:text-white">Ata Ul Mustafa</h2>
            <p className="text-blue-600 dark:text-blue-400 font-medium">Founder & CEO</p>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              With 2+ years in real estate, Ata Ul Mustafa leads our vision of transforming property search.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-gray-500 dark:text-gray-400 text-xl">
              <a href="https://www.facebook.com/share/15XPzJ4k95/" target="_blank" className="hover:text-blue-500"><FaFacebook /></a>
              <a href="https://github.com/Mustafa8382" target="_blank" className="hover:text-blue-500"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/ataulmustafaansari" target="_blank" className="hover:text-blue-500"><FaLinkedin /></a>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <img
              src={adeelImage}
              alt="Adeel Ahmad"
              className="w-32 h-32 rounded-full mx-auto object-cover"
            />
            <h2 className="text-xl font-bold mt-4 text-gray-800 dark:text-white">Adeel Ahmad</h2>
            <p className="text-blue-600 dark:text-blue-400 font-medium">Chief Technology Officer</p>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Tech innovator driving our platform's cutting-edge solutions.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-gray-500 dark:text-gray-400 text-xl">
              <a href="#" className="hover:text-blue-500"><FaFacebook /></a>
              <a href="#" className="hover:text-blue-500"><FaGithub /></a>
              <a href="#" className="hover:text-blue-500"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Why Choose AMEstate Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Why Choose AMEstate?</h2>
            <div className="w-24 h-1 bg-blue-600 dark:bg-blue-400 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Experience the difference with our comprehensive property solutions
            </p> 
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:rotate-6'>
                    <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>  
                </div>
                <h2 className="text-2xl font-bold mt-3 text-gray-800 dark:text-white">Verified Properties</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Every property is thoroughly verified for quality and security.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:rotate-6'>
                    <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>  
                </div>
                <h2 className="text-2xl font-bold mt-3 text-gray-800 dark:text-white">User-Friendly Platform</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Intuitive navigation and seamless property management.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:rotate-6'>
                    <Headphones className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>  
                </div>
                <h2 className="text-2xl font-bold mt-3 text-gray-800 dark:text-white">24/7 Support</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Round-the-clock assistance for all your queries.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:rotate-6'>
                    <List className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>  
                </div>
                <h2 className="text-2xl font-bold mt-3 text-gray-800 dark:text-white">Comprehensive Listings</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Wide range of properties to match every need and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-blue-100 dark:bg-gray-900 py-16 px-4 rounded-2xl max-w-6xl mx-auto hover:shadow-lg transition-shadow duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {milestones.map((m, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-blue-700 dark:text-blue-400">{counters[i]}+</div>
              <div className="text-gray-700 dark:text-gray-300 mt-2">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 dark:text-white">
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              className="w-full px-6 py-4 bg-white dark:bg-gray-800 flex justify-between items-center text-left"
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                {faq.q}
              </span>
              <span className="text-blue-600 dark:text-blue-400 text-xl">
                {openFAQ === index ? '-' : '+'}
              </span>
            </button>

            {openFAQ === index && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-all duration-300">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
