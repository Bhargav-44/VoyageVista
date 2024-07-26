"use client";

import React from "react";
import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

// Constants
const POPULAR_DESTINATIONS = [
  { name: "Kyoto", image: "/kyoto.jpg" },
  { name: "Santorini", image: "/santorini.jpg" },
  { name: "Machu Picchu", image: "/machu-picchu.jpg" },
];

const FEATURES = [
  { 
    title: "Share Your Journey", 
    description: "Document your travels with stories, photos, and tips to inspire fellow adventurers.",
    icon: "📖"
  },
  { 
    title: "Connect Globally", 
    description: "Join discussions, meet travelers, and forge friendships across the world.",
    icon: "🌏"
  },
  { 
    title: "Plan Together", 
    description: "Collaborate on trip planning and get advice from experienced travelers.",
    icon: "🗺️"
  },
  { 
    title: "Discover Hidden Gems", 
    description: "Uncover off-the-beaten-path destinations shared by our community.",
    icon: "💎"
  },
];

const FOOTER_LINKS = ["About Us", "Contact", "Terms of Service", "Privacy Policy"];

// Components
const HeroSection = () => (
  <section className="relative font-sans h-screen">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 bg-black bg-opacity-30"
    ></motion.div>
    <motion.img 
      src="./cover.jpg" 
      alt="World Map" 
      className="w-full h-full object-cover"
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 space-y-8">
      <motion.h1 
        className="text-6xl md:text-7xl font-extrabold text-center leading-tight text-white drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Your Journey, Your Story
      </motion.h1>
      <motion.p 
        className="text-2xl md:text-3xl text-center max-w-3xl text-white drop-shadow-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Explore, Share, and Inspire with VoyageVista
      </motion.p>
      <motion.button 
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Your Journey
      </motion.button>
    </div>
  </section>
);

const DestinationCard = ({ name, image }) => (
  <motion.article 
    className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition duration-300"
    whileHover={{ y: -5 }}
  >
    <img src="./cover.jpg" alt={name} className="w-full h-64 object-cover" />
    <div className="p-6 bg-white">
      <h3 className="font-bold text-2xl mb-2 text-gray-800">{name}</h3>
      <p className="text-gray-600">Discover the wonders of {name} through our travelers' eyes.</p>
    </div>
  </motion.article>
);

DestinationCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

const PopularDestinations = () => (
  <section className="py-20 px-8 bg-gray-100">
    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Popular Destinations</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {POPULAR_DESTINATIONS.map((dest) => (
        <DestinationCard key={dest.name} {...dest} />
      ))}
    </div>
  </section>
);

const FeatureCard = ({ title, description, icon }) => (
  <motion.article 
    className="text-center p-6 bg-white rounded-xl shadow-lg"
    whileHover={{ y: -10 }}
  >
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-4xl">
      {icon}
    </div>
    <h3 className="font-bold text-2xl mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.article>
);

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

const Features = () => (
  <section className="py-20 px-8 bg-white">
    <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose VoyageVista?</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white py-12 px-8">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
      <div className="mb-8 md:mb-0">
        <img src="./cover.png" alt="VoyageVista Logo" className="w-20 h-20 inline-block mr-4" />
        <span className="text-3xl font-semibold">VoyageVista</span>
      </div>
      <ul className="flex flex-wrap justify-center space-x-8">
        {FOOTER_LINKS.map((link) => (
          <li key={link}>
            <a href="#" className="hover:text-blue-400 transition duration-300 text-lg">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

const Home = () => (
  <div className="font-sans">
    <Navbar />
    <main>
      <HeroSection />
      <PopularDestinations />
      <Features />
    </main>
    <Footer />
  </div>
);

export default Home;