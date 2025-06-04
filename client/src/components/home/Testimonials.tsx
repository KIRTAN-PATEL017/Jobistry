import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    quote: 'Jobistry helped us find top-notch developers who turned our vision into reality. The quality of freelancers and the platform\'s ease of use exceeded our expectations.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'Innovate Labs',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    quote: 'As someone who regularly needs to hire specialists for various projects, Jobistry has become my go-to platform. The talent quality and project management tools are exceptional.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Freelance Designer',
    company: 'Self-employed',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    quote: 'Since joining Jobistry as a freelancer, I\'ve connected with amazing clients from around the world. The platform makes it easy to showcase my portfolio and get paid securely.',
    rating: 4,
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Marketing Director',
    company: 'GrowthEdge',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    quote: 'We needed to scale our content marketing quickly, and Jobistry delivered. Within days we had a team of talented writers who understood our brand voice perfectly.',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it — hear from the talented freelancers and clients who've experienced success on our platform.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <motion.div 
                  key={testimonial.id}
                  className="min-w-full px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-xl shadow-md p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="mb-6 md:mb-0 md:mr-8">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
                        />
                      </div>
                      <div>
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              size={20} 
                              className={i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <blockquote className="text-gray-700 text-lg italic mb-6">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-gray-600">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 focus:outline-none z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 focus:outline-none z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false);
                  setActiveIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-primary-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;