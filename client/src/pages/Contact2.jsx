import React, { useRef, useState } from 'react';
import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from 'framer-motion';
import Footer from '../components/Footer.jsx';

export default function Contact2() {
  const nameRef = useRef();
  const emailRef = useRef();
  const subjectRef = useRef();
  const messageRef = useRef();
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      subject: subjectRef.current.value,
      message: messageRef.current.value,
    };

    try {
      const res = await fetch('http://localhost:3000/Api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('✅ Message sent successfully!');
        e.target.reset();
      } else {
        setStatus('❌ Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Server error. Please try again later.');
    }
  };

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 p-1 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center my-6 mx-6 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"
            animate={{
              background: [
                'linear-gradient(to bottom right, rgba(37, 99, 235, 1), rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.8))',
                'linear-gradient(to bottom right, rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.8), rgba(37, 99, 235, 1))',
                'linear-gradient(to bottom right, rgba(236, 72, 153, 0.8), rgba(37, 99, 235, 1), rgba(147, 51, 234, 0.9))'
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-blue-300"
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0],
                scale: [1, 1.1, 1, 0.9, 1]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-300"
              animate={{
                x: [0, -40, 0, 40, 0],
                y: [0, 40, 0, -40, 0],
                scale: [1, 0.9, 1, 1.1, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative text-center text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-6xl mx-auto z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Get in Touch With Us</h1>
          <p className="text-lg md:text-xl text-white/90 dark:text-gray-300">
            Have questions about our properties? Need assistance with finding your perfect home?
          </p>
          <motion.div
            className="w-24 h-1 bg-white mx-auto mt-8"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }} />
        </motion.div>
      </section>

      {/* Info Cards */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-12 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Office
          </h2>
          <p>Noor Shah Wali, Kasur, Pakistan</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Call
          </h2>
          <p>+92-3254634574</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Email
          </h2>
          <p>amrealestate@gmail.com</p>
        </div>
      </section>

      {/* Form & Testimonials */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4 pb-16">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input type="text" required ref={nameRef}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white"
                placeholder="Enter your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" required ref={emailRef}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white"
                placeholder="example@gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input type="text" ref={subjectRef}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white"
                placeholder="e.g., Property Inquiry" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows="5" ref={messageRef}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white"
                placeholder="Write your message here..." />
            </div>
            {status && (
              <p className="text-sm mt-2 text-green-500 dark:text-green-400">{status}</p>
            )}
            <button type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300">
              Submit
            </button>
          </form>
        </div>

        {/* Testimonials Carousel */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <motion.h2
            className="text-3xl font-bold text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What Our Clients Say
          </motion.h2>

          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[
              {
                name: "Fatima Jinnah",
                feedback: "This real estate team helped me find my dream home quickly and professionally!",
                role: "Home Buyer"
              },
              {
                name: "Dr. Sharafat Ali",
                feedback: "The booking and payment process was smooth. Highly recommended!",
                role: "Seller"
              },
              {
                name: "Haji Khalid Hussain",
                feedback: "Very professional and trustworthy. The support team is amazing!",
                role: "Investor"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:scale-[1.02] transition-transform duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.2 }}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4">“{testimonial.feedback}”</p>
                <h4 className="text-lg font-semibold text-blue-600">{testimonial.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Icons */}
      <section className="text-center pb-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Follow us on</p>
        <div className="flex justify-center gap-6 text-2xl">
          <a href="https://www.facebook.com/share/15XPzJ4k95/" target='blank' className="text-blue-600 hover:text-blue-800">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://github.com/Mustafa8382" target='blank' className="text-blue-400 hover:text-blue-600">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/ataulmustafaansari" target='blank' className="text-pink-600 hover:text-pink-800">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
