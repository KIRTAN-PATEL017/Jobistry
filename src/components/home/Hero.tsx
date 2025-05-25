import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary-900 to-secondary-900 text-white py-20 md:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-500"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 rounded-full bg-secondary-500"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-accent-500"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find the Perfect Match for Your Next Project
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
              Connect with top freelancers or find quality projects on Jobistry, 
              the trusted marketplace for professional services.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/signup?role=client" 
                className="btn bg-white text-primary-700 hover:bg-gray-100"
              >
                Hire Talent
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link 
                to="/signup?role=freelancer" 
                className="btn border border-white text-white hover:bg-white/10"
              >
                Find Work
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Professionals collaborating" 
              className="rounded-lg shadow-2xl max-w-full h-auto"
            />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold">20K+</p>
            <p className="text-sm opacity-80 mt-2">Skilled Freelancers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold">10K+</p>
            <p className="text-sm opacity-80 mt-2">Completed Projects</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold">$15M+</p>
            <p className="text-sm opacity-80 mt-2">Paid to Freelancers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold">4.8/5</p>
            <p className="text-sm opacity-80 mt-2">Client Satisfaction</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;