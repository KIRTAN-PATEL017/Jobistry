import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Gem } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck size={40} className="text-primary-500" />,
    title: 'Secure Payments',
    description: 'Your payments are protected through our secure escrow system. Funds are only released when you\'re satisfied with the work.',
  },
  {
    icon: <Zap size={40} className="text-primary-500" />,
    title: 'Quick Matching',
    description: 'Our intelligent matching algorithm connects you with the most suitable freelancers for your project needs.',
  },
  {
    icon: <Globe size={40} className="text-primary-500" />,
    title: 'Global Talent',
    description: 'Access top professionals from around the world, with diverse skills and expertise across all industries.',
  },
  {
    icon: <Gem size={40} className="text-primary-500" />,
    title: 'Quality Guaranteed',
    description: 'All freelancers are pre-vetted through our rigorous verification process, ensuring you work with only the best.',
  },
];

const Features: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Jobistry
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to connect, collaborate, and create amazing work together.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="mb-4 p-3 bg-primary-50 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;